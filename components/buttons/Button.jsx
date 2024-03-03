export default function Button(props) {
  return (
    <button
      type="submit"
      className="bg-slate-300 hover:bg-slate-400 text-black rounded-full mr-4 mt-4 py-2 px-5"
    >
      {props.button}
    </button>
  );
}
