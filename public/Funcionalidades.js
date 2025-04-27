// Cerrar cualquier modal por su ID
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
  }
  
  // Mostrar notificación (única a la vez)
  function showNotification(message, isSuccess) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
  
    const notification = document.createElement('div');
    notification.className = `notification ${isSuccess ? 'success' : 'error'}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    // --- CONFIGURAR MODALS --- //
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
      const closeIcon = modal.querySelector(closeSelector);
  
      modal.style.display = 'none';
  
      btn?.addEventListener('click', e => {
        e.preventDefault();
        modal.style.display = 'flex';
      });
  
      closeIcon?.addEventListener('click', () => closeModal(modalId));
  
      window.addEventListener('click', e => {
        if (e.target === modal) closeModal(modalId);
      });
    });
  
    // --- SUBMIT FORM PRODUCTOR --- //
    document.getElementById('formProductor')?.addEventListener('submit', async function(e) {
      e.preventDefault();
      const nombre = document.getElementById('nombre-productor').value.trim();
      const correo = document.getElementById('correo-productor').value.trim();
      const celular = document.getElementById('celular-productor').value.trim();
  
      try {
        const res = await fetch('/api/guardar-productor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, correo, celular })
        });
        const data = await res.json();
  
        if (data.success) {
          showNotification(data.mensaje, true);
          closeModal('modalProductor');
          this.reset();
        } else {
          showNotification(data.error || 'Error al enviar la solicitud', false);
        }
      } catch (err) {
        console.error(err);
        showNotification('Error de conexión con el servidor', false);
      }
    });
  
    // --- SUBMIT FORM DISTRIBUIDOR --- //
    document.querySelector('.formulario-distribuidor')?.addEventListener('submit', async function(e) {
      e.preventDefault();
      const nombre = document.getElementById('nombre-distribuidor').value.trim();
      const correo = document.getElementById('correo-distribuidor').value.trim();
      const celular = document.getElementById('celular-distribuidor').value.trim();
  
      try {
        const res = await fetch('/api/guardar-distribuidor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, correo, celular })
        });
        const data = await res.json();
  
        if (data.success) {
          showNotification(data.mensaje, true);
          closeModal('modalDistribuidor');
          this.reset();
        } else {
          showNotification(data.error || 'Error al enviar la solicitud', false);
        }
      } catch (err) {
        console.error(err);
        showNotification('Error de conexión con el servidor', false);
      }
    });
});
  