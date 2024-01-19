export default function Ingredients(props) {
  return (
    <>
      <h2 className="text-2xl mt-6">Ingredients</h2>
      <textarea
        name="ingredients"
        type="test"
        className="w-full h-60 text-black placeholder:pl-2"
        defaultValue={props.ingredients}
      />
    </>
  );
}
