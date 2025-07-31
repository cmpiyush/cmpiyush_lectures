// Function to create a compact subject selector dropdown
function createSubjectSelector(structure, currentSemester) {
  const subjectSelector = document.createElement('select');
  subjectSelector.classList.add('form-select', 'form-select-sm', 'mb-2');
  
  // Add default option
  const defaultOption = document.createElement('option');
  defaultOption.textContent = 'Select Subject';
  defaultOption.value = '';
  subjectSelector.appendChild(defaultOption);
  
  // Add subject options for current semester
  for (let subject in structure[currentSemester]) {
    const option = document.createElement('option');
    option.textContent = subject;
    option.value = subject;
    subjectSelector.appendChild(option);
  }
  
  // Add change event listener
  subjectSelector.addEventListener('change', function() {
    const selectedSubject = this.value;
    if (selectedSubject) {
      // Hide all subject sections
      document.querySelectorAll('.subject-section').forEach(section => {
        section.style.display = 'none';
      });
      
      // Show selected subject section
      const getSubjectSectionId = subject => `subject-${subject.replace(/\s+/g, '-')}`;
      const selectedSection = document.getElementById(getSubjectSectionId(selectedSubject));
      if (selectedSection) {
        selectedSection.style.display = 'block';
      }
    }
  });
  
  return subjectSelector;
}