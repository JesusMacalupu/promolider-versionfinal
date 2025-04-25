// Hacer visible el modal de Productores
document.addEventListener("DOMContentLoaded", function () {
    const btnProductor = document.querySelector('.btn-green:nth-child(1)');
    const modal = document.getElementById("modalProductor");
    const closeModal = modal.querySelector(".close-icon");

    // Asegurarse de que el modal esté oculto al cargar
    modal.style.display = "none";

    btnProductor.addEventListener("click", (e) => {
        e.preventDefault();
        modal.style.display = "flex";
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});

// Mostrar modal de Distribuidor al hacer click
document.addEventListener("DOMContentLoaded", function () {
    const btnDistribuidor = document.querySelector('.btn-green:nth-child(2)');
    const modalDistribuidor = document.getElementById("modalDistribuidor");
    const closeModalDistribuidor = modalDistribuidor.querySelector(".close-icon-distribuidor");

    // Asegurarse de que el modal esté oculto al cargar
    modalDistribuidor.style.display = "none";

    btnDistribuidor.addEventListener("click", (e) => {
        e.preventDefault();
        modalDistribuidor.style.display = "flex";
    });

    closeModalDistribuidor.addEventListener("click", () => {
        modalDistribuidor.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modalDistribuidor) {
            modalDistribuidor.style.display = "none";
        }
    });
});