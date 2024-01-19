export default function SaveButton(props) {
  return (
    <button
      type="submit"
      className="bg-slate-300 hover:bg-slate-400 text-black rounded-full mr-4 mt-4 p-2"
    >
      {props.button}
    </button>
  );
}
