const deleteProduct = (btn) => {
  const prodID = btn.parentNode.querySelector("[name=productId]").value;
  const csrfToken = btn.parentNode.querySelector("[name=_csrf]").value;

  const productElement = btn.closest("article");

  fetch("/admin/product/" + prodID, {
    method: "DELETE",
    headers: {
      "csrf-token": csrfToken,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then(() => {
      productElement.remove();
    })
    .catch((err) => {
      console.log(err);
    });
};
