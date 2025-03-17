/*
A "page" is distinct from a component in that a page
is made up of components. A page simply organizes the
components, using props to pass down shared state.
*/

// import GoHomeButton from "../components/GoHomeButton";

const NotFoundPage = () => {
  return (
    <main>
      <h1>
        Page not Found
      </h1>
      {/* <GoHomeButton /> */}
    </main>
  );
}

export default NotFoundPage;
