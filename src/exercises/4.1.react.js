/*
  🍀 Some things to know about this:
  - Everything is fine with the form. Focus on the results area.
  - You can change the loading time at line 130.
  - The page "7" will throw a results error.
*/

function Exercise() {
  const [page, setPage] = React.useState(""); // input page value
  const [products, setProcuts] = React.useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = React.useState(false);
  const [productsError, setProductsError] = React.useState(null);
  const isFormValid = page >= 1 && page <= 9;
  const isProductsOkay = !productsError && !isLoadingProducts;
  const isFormSubmitActive = isFormValid && !isLoadingProducts;

  async function handleSubmit(e) {
    e.preventDefault(); // avoid native form submit (page refresh)

    setIsLoadingProducts(true);
    setProductsError(null);

    try {
      const productsList = await fetchProducts(page);
      setProcuts(productsList);
    } catch (err) {
      const errorMessage = `Ups, something went wrong.`;
      setProductsError(errorMessage);
    } finally {
      setIsLoadingProducts(false);
    }
  }

  return (
    <main className="content">
      <h1 className="title-xl">Loading states</h1>

      <div className="demo g-card">
        {/* 🍀 Everything is okay with the form itself.
        For this exercise, focus just on the results area :) */}
        <form className="area" noValidate onSubmit={handleSubmit}>
          <div className="areaStart">
            <div className="field">
              <label htmlFor="page" className="fieldLabel">
                Page
              </label>
              <input
                id="page"
                className="fieldInput"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                placeholder="0"
                required
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="areaEnd">
            <div className={`tooltipArea ${isFormValid ? "" : "isActive"}`}>
              <button
                type="submit"
                className="btnSubmit"
                data-loading={isLoadingProducts}
                disabled={!isFormSubmitActive}
                aria-describedby={isFormValid ? "" : "disabledReason"}
              >
                <span className="btnSubmit-text">Get products</span>
              </button>

              <div role="tooltip" className="tooltipBox" id="disabledReason">
                <span className="tooltipItself">Choose from page 1 to 9</span>
              </div>
            </div>
          </div>
        </form>

        <div className="resultsArea">
          {/* Empty State */}
          {products.length === 0 && isProductsOkay && <p>No products yet.</p>}

          {/* 💡 Below it's the multiple dynamic states.
          Create the necessary live regions to ensure the
          dynamic content is announced by assistive technologies. */}

          {/* Loading state */}
          {isLoadingProducts && <p>Loading products...</p>}

          {/* Error state */}
          {productsError && <p>{productsError}</p>}

          {/* Products list */}
          {products.length > 0 && isProductsOkay && (
            <div>
              <ul>
                {products.map((product) => (
                  <li key={product.id}>Product {product.id}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <p>
          A{" "}
          <a href="#fake-link" className="link">
            dummy link
          </a>{" "}
          for demo.
        </p>
      </div>
    </main>
  );
}

/* ============================== *\
\* You can ignore the code below. */

async function fetchProducts(page) {
  console.log("Loading products from page:", page);

  if (page === 7) {
    // Simulate a problem with this page for demo purposes.
    await fakeWaitTime(500);
    throw Error("Page 7 is unstable.");
  }

  await fakeWaitTime(2500);

  // Return a dummy array of 10 items. Each item is an object. eg
  // [{ id: 20 }, { id: 21 }, { id: 22 }, { id: 23 }, ...]
  return Array.from(Array(10), (_, i) => ({
    id: `${page}${i}`,
  }));
}

function fakeWaitTime(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Exercise />, rootElement);
