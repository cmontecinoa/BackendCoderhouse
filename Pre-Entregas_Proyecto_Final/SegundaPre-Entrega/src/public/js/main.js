/*Generamos una instancia de Socket.io, ahora dede el lado del cliente*/
const socket = io();

//Recepción la información de productos de el servidor
socket.on("productos", (data) => {
  renderProductos(data);
});

//Funcion para renderizar nuetros productos

const renderProductos = (productos) => {
  const containerProductos = document.getElementById("IDcontainerProductos");
  containerProductos.innerHTML = "";

  productos.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
    <p>${item.id}</p>
    <p><${item.title}/p>
    <p>${item.description}</p>
    <p>${item.price}</p>
    <button> Eliminar </button>
    `;
    containerProductos.appendChild(card);

    //Agregamos el evento al botón para eliminar
    card.querySelector("button").addEventListener("click", () => {
      eliminarProducto(item.id);
    });
  });
};

const eliminarProducto = (id) => {
  socket.emit("eliminarProducto", id);
};

//Agregamos productos del formulario

document.getElementById("btnEnviar").addEventListener("click", () => {
  agregarProducto();
});

const agregarProducto = () => {
  const producto = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    thumbnail: document.getElementById("img").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    status: document.getElementById("status").value,
  };
  socket.emit("agregarProducto", producto);
};
