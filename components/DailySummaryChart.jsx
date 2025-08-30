"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";

const TOPIC_COLORS = {
  food: "#DC965A",
  mood: "#00CFC1", 
  meds: "#773344",
  bowel: "#3C493F"
};

const TOPIC_LABELS = {
  food: "Food",
  mood: "Mood", 
  meds: "Medications",
  bowel: "Bowel"
};

export default function DailySummaryChart({ userEmail }) {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTopics, setSelectedTopics] = useState(['food', 'mood', 'meds', 'bowel']);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  // Fetch entries when date or topics change
  useEffect(() => {
    fetchEntries();
  }, [selectedDate, selectedTopics]);

  const handlePrint = () => {
    // Print the current page (browser print dialog)
    if (typeof window !== 'undefined') window.print();
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const title = `Daily summary for ${format(new Date(selectedDate + 'T12:00:00'), 'MMMM d, yyyy')}`;

    // Build a plain-text summary from entries
    const summaryLines = [title, ''];
    entries.forEach((entry) => {
      const time = format(new Date(entry.createdAt), 'h:mm a');
      summaryLines.push(`${time} ${TOPIC_LABELS[entry.topic]} - ${entry.title}`);
      if (entry.notes) summaryLines.push(`  Notes: ${entry.notes}`);
      if (entry.ingredients && entry.ingredients.length) summaryLines.push(`  Ingredients: ${Array.isArray(entry.ingredients) ? entry.ingredients.join(', ') : entry.ingredients}`);
      summaryLines.push('');
    });

    const summaryText = summaryLines.join('\n');

    if (navigator.share) {
      try {
        await navigator.share({ title, text: summaryText });
        setShareMessage('Shared successfully');
      } catch (err) {
        console.error('Share failed', err);
        setShareMessage('Share canceled or failed');
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(summaryText);
        setShareMessage('Summary copied to clipboard');
      } catch (err) {
        console.error('Clipboard write failed', err);
        setShareMessage('Unable to copy summary');
      }
    } else {
      setShareMessage('Sharing not supported in this browser');
    }

    // Clear message after 2.5s
    setTimeout(() => setShareMessage(''), 2500);
  };

  const handleExportPdfClient = async () => {
    if (typeof window === 'undefined') return;
    
    setShareMessage('Preparing PDF...');
    
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      
      // Check if there are entries to export
      if (entries.length === 0) {
        setShareMessage('No entries to export');
        setTimeout(() => setShareMessage(''), 3000);
        return;
      }

      // Create a clean HTML structure without problematic CSS
      const title = `Entries for ${format(new Date(selectedDate + 'T12:00:00'), 'MMMM d, yyyy')}`;
      
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h1 style="margin-bottom: 20px; font-size: 24px; color: #1f2937;">${title}</h1>
          ${entries.map((entry, index) => `
            <div style="
              background-color: ${TOPIC_COLORS[entry.topic]};
              color: white;
              padding: 16px;
              margin-bottom: 12px;
              border-radius: 8px;
              page-break-inside: avoid;
            ">
              <div style="display: flex; gap: 16px; align-items: flex-start;">
                <div style="font-size: 14px; font-weight: 500; min-width: 60px;">
                  ${formatTime(entry.createdAt)}
                </div>
                <div style="flex: 1;">
                  <div style="font-size: 12px; text-transform: uppercase; font-weight: 500; opacity: 0.9; margin-bottom: 8px;">
                    ${TOPIC_LABELS[entry.topic]}
                  </div>
                  <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">${entry.title}</h3>
                  ${entry.notes ? `<p style="font-size: 14px; opacity: 0.9; margin: 0 0 8px 0;">${entry.notes}</p>` : ''}
                  ${entry.ingredients && entry.ingredients.length > 0 ? `
                    <div style="font-size: 14px;">
                      <span style="font-weight: 500;">Ingredients: </span>
                      <span style="opacity: 0.9;">
                        ${Array.isArray(entry.ingredients) ? entry.ingredients.join(', ') : entry.ingredients}
                      </span>
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      // Create a temporary element with clean HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      document.body.appendChild(tempDiv);

      const opt = {
        margin:       10,
        filename:     `daily-summary-${selectedDate}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, allowTaint: true },
        jsPDF:        { unit: 'pt', format: 'a4', orientation: 'portrait' }
      };
      
      setShareMessage('Generating PDF...');
      
      try {
        await html2pdf().from(tempDiv.firstElementChild).set(opt).save();
        setShareMessage('PDF downloaded successfully!');
        setTimeout(() => setShareMessage(''), 3000);
      } finally {
        // Clean up the temporary element
        document.body.removeChild(tempDiv);
      }
      
    } catch (err) {
      console.error('html2pdf export failed', err);
      setShareMessage(`Export failed: ${err.message}`);
      setTimeout(() => setShareMessage(''), 4000);
    }
  };

  const fetchEntries = async () => {
    if (selectedTopics.length === 0) {
      setEntries([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/daily-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          date: selectedDate,
          topics: selectedTopics
        })
      });
      const data = await response.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (topic) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const formatTime = (dateString) => {
    return format(new Date(dateString), 'h:mm a');
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Date Picker */}
        <div className="flex items-center gap-2">
          <label htmlFor="date-picker" className="text-sm font-medium text-gray-700">
            Date:
          </label>
          <input
            id="date-picker"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#077187] focus:border-transparent"
          />
          <div className="ml-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-800 hover:bg-gray-200"
            >
              Print
            </button>
            <button
              type="button"
              onClick={handleExportPdfClient}
              className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-800 hover:bg-gray-50"
            >
              Export PDF
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-2 bg-[#077187] text-white rounded-md text-sm hover:opacity-95"
            >
              Share
            </button>
            {shareMessage ? (
              <span className="ml-2 text-sm text-gray-600">{shareMessage}</span>
            ) : null}
          </div>
        </div>

        {/* Topic Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(TOPIC_COLORS).map(([topic, color]) => (
            <button
              key={topic}
              onClick={() => toggleTopic(topic)}
              className={`px-3 py-2 rounded-lg text-white text-sm font-medium transition-opacity ${
                selectedTopics.includes(topic) ? 'opacity-100' : 'opacity-50'
              }`}
              style={{ backgroundColor: color }}
            >
              {TOPIC_LABELS[topic]}
            </button>
          ))}
        </div>
      </div>

      {/* Chart/Timeline */}
      <div className="daily-summary-print-area">
        <div className="bg-white rounded-lg shadow-lg p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-[#077187] rounded-full mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading entries...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No entries found for the selected date and topics.
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Entries for {format(new Date(selectedDate + 'T12:00:00'), 'MMMM d, yyyy')}
            </h3>
            <div className="space-y-3">
              {entries.map((entry, index) => (
                <div
                  key={entry.id || index}
                  className="flex items-start gap-4 p-6 rounded-lg text-white min-h-[240px]"
                  style={{ backgroundColor: TOPIC_COLORS[entry.topic] }}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium uppercase tracking-wide opacity-90">
                        {TOPIC_LABELS[entry.topic]}
                      </span>
                      <div className="flex-shrink-0 text-sm font-medium">
                        {formatTime(entry.createdAt)}
                      </div>
                    </div>
                    <h4 className="font-semibold text-lg mb-1">{entry.title}</h4>
                    {entry.notes && (
                      <p className="text-sm opacity-90 mb-2">{entry.notes}</p>
                    )}
                    {entry.ingredients && entry.ingredients.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium">Ingredients: </span>
                        <span className="opacity-90">
                          {Array.isArray(entry.ingredients) 
                            ? entry.ingredients.join(', ') 
                            : entry.ingredients}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

