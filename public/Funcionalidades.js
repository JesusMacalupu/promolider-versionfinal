// Cerrar cualquier modal por su ID
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'none';
}

// Mostrar notificación dentro del modal
function showModalNotification(modalId, message, isSuccess) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  
  const existing = modal.querySelector('.modal-notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `modal-notification notification ${isSuccess ? 'success' : 'error'}`;
  notification.textContent = message;
  
  modal.appendChild(notification);
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  // Configurar modals
  const setups = [
    {
      btnSelector: '.btn-green:nth-child(1)',
      modalId: 'modalProductor',
      closeSelector: '.close-icon'
    },
    {
      btnSelector: '.btn-green:nth-child(2)',
      modalId: 'modalDistribuidor',
      closeSelector: '.close-icon-distribuidor'
    }
  ];

  setups.forEach(({ btnSelector, modalId, closeSelector }) => {
    const btn = document.querySelector(btnSelector);
    const modal = document.getElementById(modalId);
    const closeIcon = modal?.querySelector(closeSelector);

    if (modal) modal.style.display = 'none';

    btn?.addEventListener('click', e => {
      e.preventDefault();
      if (modal) modal.style.display = 'flex';
    });

    closeIcon?.addEventListener('click', () => closeModal(modalId));

    // Cerrar modal si se hace clic fuera del modal
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modalId);
      }
    });
  });

  // --- SUBMIT FORM PRODUCTOR --- //
  document.getElementById('formProductor')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre-productor').value.trim();
    const correo = document.getElementById('correo-productor').value.trim();
    const celular = document.getElementById('celular-productor').value.trim();

    // Validación de correo (permite ñ solo antes del @)
    const emailRegex = /^[a-zA-Z0-9ñÑ._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(correo)) {
      showModalNotification('modalProductor', 'Formato de correo no válido. Ejemplo: usuarioñ@gmail.com', false);
      return;
    }

    try {
      const res = await fetch('/api/guardar-productor', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({ nombre, correo, celular })
      });
      const data = await res.json();

      if (data.success) {
        showModalNotification('modalProductor', data.mensaje, true);
        this.reset();
      } else {
        showModalNotification('modalProductor', data.error || 'Error al enviar la solicitud', false);
      }
    } catch (err) {
      console.error(err);
      showModalNotification('modalProductor', 'Error de conexión con el servidor', false);
    }
  });

  // --- SUBMIT FORM DISTRIBUIDOR --- //
  document.querySelector('.formulario-distribuidor')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre-distribuidor').value.trim();
    const correo = document.getElementById('correo-distribuidor').value.trim();
    const celular = document.getElementById('celular-distribuidor').value.trim();

    // Validación de correo (permite ñ solo antes del @)
    const emailRegex = /^[a-zA-Z0-9ñÑ._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(correo)) {
      showModalNotification('modalDistribuidor', 'Formato de correo no válido. Ejemplo: usuarioñ@gmail.com', false);
      return;
    }

    try {
      const res = await fetch('/api/guardar-distribuidor', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({ nombre, correo, celular })
      });
      const data = await res.json();

      if (data.success) {
        showModalNotification('modalDistribuidor', data.mensaje, true);
        this.reset();
      } else {
        showModalNotification('modalDistribuidor', data.error || 'Error al enviar la solicitud', false);
      }
    } catch (err) {
      console.error(err);
      showModalNotification('modalDistribuidor', 'Error de conexión con el servidor', false);
    }
  });
});