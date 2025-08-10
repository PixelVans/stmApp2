import ingredients from "../data/ingredients.json";

export default function NewPage() {
  console.log("Ingredients:", ingredients);

  return (
    <div>
      <h1>First Temp: {ingredients[0][12]}</h1>
      <h1>Second Temp: {ingredients[1][12]}</h1>
    </div>
  );
}
