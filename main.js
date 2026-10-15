/**
 * Eklavya Multispeciality Hospital & Maternity Home, Vyara
 * Main Interactive Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Real-Time OPD Status
  updateOpdStatus();
  setInterval(updateOpdStatus, 60000); // Check every minute

  // 2. Mobile Menu Toggle
  setupMobileMenu();

  // 3. Department Tabs Switching
  setupDepartmentTabs();

  // 4. FAQ Accordion
  setupFaqAccordion();

  // 5. Appointment Booking Modal & Forms
  setupAppointmentBooking();

  // 6. Copy to Clipboard Utility
  setupClipboardButtons();

  // 7. Dynamic Date Setting on Form
  setupDateInput();
});

/**
 * Calculates whether routine OPD is currently open based on official hospital timings:
 * Monday - Friday: 10:00 AM - 01:00 PM & 05:00 PM - 07:00 PM
 * Saturday: 10:00 AM - 04:00 PM
 * Sunday: Routine OPD Closed (Emergency/Trauma 24/7 Operational)
 */
function updateOpdStatus() {
  const now = new Date();
  const day = now.getDay(); // 0 is Sunday, 1 is Mon, 6 is Sat
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes; // minutes from midnight

  const statusPill = document.getElementById('live-opd-status');
  const statusDetails = document.getElementById('live-opd-details');
  const statusDot = document.getElementById('live-status-dot');

  if (!statusPill || !statusDetails || !statusDot) return;

  let isOpen = false;
  let statusText = '';
  let subText = '';

  const t10AM = 10 * 60; // 600
  const t1PM = 13 * 60;  // 780
  const t4PM = 16 * 60;  // 960
  const t5PM = 17 * 60;  // 1020
  const t7PM = 19 * 60;  // 1140

  if (day >= 1 && day <= 5) {
    // Mon - Fri
    if (currentTime >= t10AM && currentTime < t1PM) {
      isOpen = true;
      statusText = 'OPD Open Now (Morning Session)';
      subText = 'Routine consultations active until 1:00 PM • Evening Session: 5:00 PM – 7:00 PM';
    } else if (currentTime >= t1PM && currentTime < t5PM) {
      isOpen = false;
      statusText = 'OPD Afternoon Break';
      subText = 'Reopens at 5:00 PM today • 24/7 Trauma Emergency Unit is fully ACTIVE';
    } else if (currentTime >= t5PM && currentTime < t7PM) {
      isOpen = true;
      statusText = 'OPD Open Now (Evening Session)';
      subText = 'Evening consultations active until 7:00 PM • Emergency active 24/7';
    } else if (currentTime < t10AM) {
      isOpen = false;
      statusText = 'OPD Opens at 10:00 AM Today';
      subText = 'Morning Session: 10:00 AM – 1:00 PM • 24/7 Emergency active right now';
    } else {
      isOpen = false;
      statusText = 'Routine OPD Closed for the Night';
      subText = 'Reopens tomorrow at 10:00 AM • 24/7 Emergency & Trauma care operational';
    }
  } else if (day === 6) {
    // Saturday
    if (currentTime >= t10AM && currentTime < t4PM) {
      isOpen = true;
      statusText = 'OPD Open Now (Saturday Session)';
      subText = 'Continuous consultations active until 4:00 PM • Emergency active 24/7';
    } else if (currentTime < t10AM) {
      isOpen = false;
      statusText = 'OPD Opens at 10:00 AM Today (Saturday)';
      subText = 'Saturday Session: 10:00 AM – 4:00 PM • 24/7 Emergency active';
    } else {
      isOpen = false;
      statusText = 'Routine OPD Closed for Today';
      subText = 'Sunday: Emergency Only • Monday OPD opens at 10:00 AM';
    }
  } else {
    // Sunday (0)
    isOpen = false;
    statusText = 'Routine OPD Closed Today (Sunday)';
    subText = '24/7 Emergency Trauma & Maternity Unit is fully operational on Sunday';
  }

  // Update UI Elements
  if (isOpen) {
    statusDot.className = 'w-3 h-3 rounded-full bg-emerald-500 pulse-opd-open inline-block mr-2';
    statusPill.innerHTML = `<span class="text-emerald-700 font-bold">${statusText}</span>`;
    statusDetails.textContent = subText;
  } else {
    statusDot.className = 'w-3 h-3 rounded-full bg-amber-500 inline-block mr-2';
    statusPill.innerHTML = `<span class="text-amber-800 font-bold">${statusText}</span>`;
    statusDetails.textContent = subText;
  }
}

/**
 * Mobile Navigation Toggle
 */
function setupMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    const isExpanded = !menu.classList.contains('hidden');
    btn.setAttribute('aria-expanded', isExpanded);
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * Tab filtering for Clinical Offerings & Departments
 */
function setupDepartmentTabs() {
  const tabs = document.querySelectorAll('.dept-tab');
  const cards = document.querySelectorAll('.dept-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all
      tabs.forEach(t => {
        t.classList.remove('bg-sky-600', 'text-white', 'shadow-md');
        t.classList.add('bg-white', 'text-slate-700', 'hover:bg-slate-100');
      });

      // Add active class to clicked tab
      tab.classList.remove('bg-white', 'text-slate-700', 'hover:bg-slate-100');
      tab.classList.add('bg-sky-600', 'text-white', 'shadow-md');

      const targetCategory = tab.getAttribute('data-dept');

      cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (targetCategory === 'all' || cardCategory === targetCategory) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/**
 * Interactive FAQ Accordion
 */
function setupFaqAccordion() {
  const faqButtons = document.querySelectorAll('.faq-toggle');

  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const content = button.nextElementSibling;
      const icon = button.querySelector('.faq-icon');
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      // Toggle current
      button.setAttribute('aria-expanded', !isExpanded);
      if (content) {
        content.classList.toggle('hidden');
      }

      if (icon) {
        icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    });
  });
}

/**
 * Handles appointment form submission and WhatsApp routing
 */
function setupAppointmentBooking() {
  const form = document.getElementById('appointment-form');
  const modal = document.getElementById('bookModal');
  const openModalBtns = document.querySelectorAll('.open-booking-modal');
  const closeModalBtns = document.querySelectorAll('.close-booking-modal');
  const confirmationModal = document.getElementById('confirmationModal');

  // Open modal triggers
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const preDoctor = btn.getAttribute('data-doctor');
      const preDept = btn.getAttribute('data-department');

      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        if (preDoctor) {
          const docSelect = document.getElementById('form-doctor');
          if (docSelect) docSelect.value = preDoctor;
        }
        if (preDept) {
          const deptSelect = document.getElementById('form-dept');
          if (deptSelect) deptSelect.value = preDept;
        }
      }
    });
  });

  // Close modal triggers
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
      if (confirmationModal) {
        confirmationModal.classList.add('hidden');
        confirmationModal.classList.remove('flex');
      }
    });
  });

  // Close on outside click
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    if (e.target === confirmationModal) {
      confirmationModal.classList.add('hidden');
      confirmationModal.classList.remove('flex');
    }
  });

  // Form submission handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const dept = document.getElementById('form-dept').value;
      const doctor = document.getElementById('form-doctor').value;
      const date = document.getElementById('form-date').value;
      const timeSlot = document.getElementById('form-timeslot').value;
      const notes = document.getElementById('form-notes').value.trim();
      const bookingType = e.submitter ? e.submitter.getAttribute('data-type') : 'standard';

      if (!name || !phone || !date) {
        showToast('Please fill in your name, contact phone, and preferred date.');
        return;
      }

      const refNo = 'EKL-' + Math.floor(100000 + Math.random() * 900000);

      // WhatsApp format
      const waMessage = encodeURIComponent(
        `*New Appointment Request - Eklavya Multispeciality Hospital, Vyara*\n` +
        `Ref ID: ${refNo}\n` +
        `Patient Name: ${name}\n` +
        `Mobile: ${phone}\n` +
        `Department: ${dept}\n` +
        `Preferred Doctor: ${doctor}\n` +
        `Requested Date: ${date}\n` +
        `Slot: ${timeSlot}\n` +
        (notes ? `Remarks: ${notes}\n` : '') +
        `Please confirm availability.`
      );

      // If user clicked "Book via WhatsApp"
      if (bookingType === 'whatsapp') {
        const waUrl = `https://wa.me/919879334364?text=${waMessage}`;
        window.open(waUrl, '_blank');
      }

      // Close booking modal
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }

      // Populate confirmation modal
      const confRef = document.getElementById('conf-ref');
      const confName = document.getElementById('conf-name');
      const confDoc = document.getElementById('conf-doctor');
      const confDate = document.getElementById('conf-date');
      const confSlot = document.getElementById('conf-slot');

      if (confRef) confRef.textContent = refNo;
      if (confName) confName.textContent = name;
      if (confDoc) confDoc.textContent = doctor;
      if (confDate) confDate.textContent = date;
      if (confSlot) confSlot.textContent = timeSlot;

      if (confirmationModal) {
        confirmationModal.classList.remove('hidden');
        confirmationModal.classList.add('flex');
      }

      form.reset();
      showToast('Appointment request recorded successfully!');
    });
  }
}

/**
 * Configure default and minimum date for appointment selector
 */
function setupDateInput() {
  const dateInput = document.getElementById('form-date');
  if (!dateInput) return;

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDate = `${yyyy}-${mm}-${dd}`;
  
  dateInput.min = minDate;
  dateInput.value = minDate;

  // Add listener for Sundays
  dateInput.addEventListener('change', () => {
    const selected = new Date(dateInput.value);
    if (selected.getDay() === 0) {
      showToast('Note: Routine OPD is closed on Sundays. Emergency trauma remains 24/7 open.', 5000);
    }
  });
}

/**
 * Clipboard copy helper
 */
function setupClipboardButtons() {
  const copyBtns = document.querySelectorAll('.copy-text-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      if (text) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Copied to clipboard: "${text}"`);
        }).catch(() => {
          showToast(`Direct copy: ${text}`);
        });
      }
    });
  });
}

/**
 * Toast Notification Utility
 */
function showToast(message, duration = 3500) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-sm transition-all duration-300 opacity-0 translate-y-4';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg class="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
    </svg>
    <span>${message}</span>
  `;

  // Show
  toast.classList.remove('opacity-0', 'translate-y-4');
  toast.classList.add('opacity-100', 'translate-y-0');

  // Hide
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-4');
  }, duration);
}
