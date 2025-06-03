document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('myModal');
  const openBtns = document.querySelectorAll('.openModalBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const contentBlocks = document.querySelectorAll('.modal-content-block');

  openBtns.forEach(button => {
    button.addEventListener('click', () => {
      // Hide all content blocks first
      contentBlocks.forEach(block => block.style.display = 'none');

      // Get which content to show from data attribute
      const contentId = button.getAttribute('data-content');
      const contentToShow = document.getElementById(contentId);

      // Show the modal and the right content block
      if(contentToShow) {
        contentToShow.style.display = 'block';
        modal.style.display = 'flex';
      }
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    contentBlocks.forEach(block => block.style.display = 'none');
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      contentBlocks.forEach(block => block.style.display = 'none');
    }
  });
});
