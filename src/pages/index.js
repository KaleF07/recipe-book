import * as React from "react";
import styled from "styled-components";
import vCard from "vcf";

// styles
const Main = styled.main`
  color: "#232129";
  padding: 96;
  font-family: "-apple-system, Roboto, sans-serif, serif";
  width: fit-content;

  fieldset,
  label {
    display: flex;
    flex-direction: column;
  }
  input {
    min-width: 280px;
    width: fit-content;
  }
`;

const ProfilePicture = styled.picture`
  display: flex;
  width: 256px;
  img {
    width: 100%;
  }
`;

const DataList = styled.dl`
  display: grid;
  grid-template-columns: auto auto;
  dt,
  dd {
    /* width: fit-content; */
    display: inline-flex;
    border: 1px solid black;
    padding: 4px;
    margin: 0;
    padding-right: 16px;
  }
  picture,
  image {
    max-width: 75px;
  }
`;

const ContactCard = ({ card }) => {
  if (!card || !card.data) return null;
  return (
    <section>
      <DataList>
        {Object.entries(card.data).map(([key, value]) => {
          const [_field, _data] = value;
          console.log(value);
          if (value._field === "photo") {
            return (
              <React.Fragment key={value._field}>
                <dt>{value._field}</dt>
                <dd>
                  <ProfilePicture>
                    <img
                      style={{ maxWidth: "75px" }}
                      src={atob(value._data)}
                      alt="profile"
                    />
                  </ProfilePicture>
                </dd>
              </React.Fragment>
            );
          } else {
            return (
              <>
                <dt>{value._field}</dt>
                <dd>{value._data}</dd>
              </>
            );
          }
        })}
      </DataList>
      <a
        href={`data:text/plain;charset=utf-8,${encodeURIComponent(
          card.toString()
        )}`}
        download="recipe.vcf"
      >
        Download VCF
      </a>
    </section>
  );
};

const IndexPage = () => {
  const [image, setImage] = React.useState("");
  const [card, setCard] = React.useState(null);
  const [actor, setActor] = React.useState(null);

  React.useEffect(() => {
    import("../declarations/recipe_book").then((module) => {
      setActor(module.recipe_book);
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const card = new vCard();
    const inputs = e.target.querySelectorAll("input");
    const name = e.target.querySelector('input[name="name"]').value;
    inputs.forEach((input) => {
      if (input.name === "photo") return;
      else if (input.name === "n") {
        // Take full input and format for vcf
        const names = input.value.split(" ");
        const arr = new Array(5);

        names.reverse().forEach((name, idx) => {
          arr[idx] = name;
        });

        card.add("fn", input.value);
        card.add(input.name, arr.join(";"));
      } else {
        card.add(input.name, input.value);
      }
    });
    card.add("photo", buffer.toString(image), { mediatype: "image/gif" });

    actor?.set(name, JSON.stringify(card.toJSON())).then(() => {
      alert("card uploaded!");
      inputs.forEach((input) => {
        input.value = "";
      });
      setImage("");
    });

    return false;
  }

  function handleUpload(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      function () {
        // convert image file to base64 string
        setImage(reader.result);
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  function getCard(e) {
    e.preventDefault();
    const name = e.target.querySelector('input[name="namesearch"]').value;

    actor?.get(name).then((returnedCard) => {
      if (!returnedCard.length) {
        return alert("No recipe found for that name");
      }
      setCard(vCard.fromJSON(returnedCard[0]));
      console.log(returnedCard);
    });
    return false;
  }

  return (
    <Main>
      <title>Recipe Book</title>
      <h1>Recipe Book stored on the Internet Computer</h1>
      <section>
        <h2>Look up a recipe by name</h2>
        <form onSubmit={getCard}>
          <label htmlFor="n">
            <input type="text" name="namesearch" id="namesearch" />
          </label>
          <button type="submit">Search</button>
        </form>
      </section>
      {/* Card Display */}
      <ContactCard card={card} />

      <form onSubmit={handleSubmit}>
        <h2>Add a Recipe</h2>
        <fieldset>
          <h3>Recipe Information</h3>
          <label htmlFor="n">
            Recipe Name
            <input type="text" name="n" autoComplete="name" />
          </label>
          <label htmlFor="desc">
            Description of Recipe
            <input type="text" name="desc" />
          </label>
        </fieldset>
        <fieldset>
          <h3>Recipe photo</h3>
          <label htmlFor="photo">
            Upload an image
            <input
              type="file"
              id="img"
              name="photo"
              accept="image/*"
              onChange={handleUpload}
            />
          </label>
          {image ? (
            <Picture>
              <img src={image} alt="user-uploaded image" />
            </Picture>
          ) : null}
        </fieldset>
        <fieldset>
          <h3>Recipe</h3>
          <label htmlFor="time">
            Time to cook
            <input type="text" name="time" />
          </label>
          <label htmlFor="ingr">
            Ingredients
            <input type="text" name="ingr" />
          </label>
          <label htmlFor="dir">
            Directions
            <input required type="text" name="dir" />
          </label>
        </fieldset>
        <button type="submit">Submit Recipe</button>
      </form>
    </Main>
  );
};

export default IndexPage;