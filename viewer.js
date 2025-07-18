// Define your structure manually or fetch from repo API
const structure = {
  "Semester 1": {
    "MSW 101": {
      "Unit-1": [
        "Goals and Functions of Social Work.md", 
        "Principles, values and philosophy of  Social Work.md",
        "System and Integrated Approach to  Social Work Practice.md",
        "The Concept of Social Work.md"
      ],
      "Unit 2": [
        "History of Social Work.md"
      ]
    },
    "MSW 102": {
      "Unit 1": [
        "Introduction to Psychology.md"
      ]
    },
    "MSW 103": {
      "Unit 1": [
        "Social Research- Meaning and purpose.md", 
        "Types of research-Pure, Applied, Basic, Action.md",
        "Social Work Research- Meaning, Steps and its relevance to social work practice.md"
      ],
      "Unit 2": [
        "Hypothesis-Meaning, Characteristics, Source and types.md", 
        "Sampling Techniques.md",
        "Sampling- Meaning, types and utility, reliability of sample, general considerations in the determination of sample size.md"
      ]
    }
  },
  "Semester 2": {
    "MSW 201": {
      "Unit 1": ["Community Organization.md"]
    }
  },
  "Semester 3": {
    "MSW 301": {
      "Unit 1": ["Example Note 1.md"]
    }
  },
  "Semester 4": {
    "MSW 401": {
      "Unit 1": ["Example Note 1.md"]
    }
  }
};

let currentSemester = "Semester 1";

const navTree = document.getElementById('nav-tree');
const noteDisplay = document.getElementById('note-display');

function createTree() {
  // Clear the navigation tree first
  navTree.innerHTML = '';
  
  // Update the current semester display
  document.getElementById('current-semester').textContent = currentSemester;
  
  // Create subject selector dropdown
  const subjectSelector = document.createElement('select');
  subjectSelector.classList.add('form-select', 'form-select-sm', 'mb-2');
  subjectSelector.innerHTML = '<option value="">All Subjects</option>';
  
  // Create a container for all subjects
  const subjectsContainer = document.createElement('div');
  
  // Only show subjects for the current semester
  for (let subject in structure[currentSemester]) {
    // Add to dropdown
    const option = document.createElement('option');
    option.value = subject;
    option.textContent = subject;
    subjectSelector.appendChild(option);
    
    // Create subject section
    const subjectSection = document.createElement('div');
    subjectSection.id = `subject-${subject.replace(/\s+/g, '-')}`;
    subjectSection.classList.add('subject-section');
    
    // Add subject header
    const subjectHeader = document.createElement('div');
    subjectHeader.classList.add('subject-header');
    subjectHeader.textContent = subject;
    subjectSection.appendChild(subjectHeader);
    
    // Create compact unit list
    for (let unit in structure[currentSemester][subject]) {
      const unitDiv = document.createElement('div');
      unitDiv.classList.add('unit-container');
      
      const unitHeader = document.createElement('div');
      unitHeader.classList.add('unit-header');
      unitHeader.textContent = unit;
      unitDiv.appendChild(unitHeader);
      
      const topicList = document.createElement('div');
      topicList.classList.add('topic-list');
      
      structure[currentSemester][subject][unit].forEach(topic => {
        const topicItem = document.createElement('div');
        topicItem.classList.add('topic-item');
        topicItem.textContent = topic.replace('.md', '');
        topicItem.onclick = () => {
          // Highlight the selected item
          document.querySelectorAll('.active-item').forEach(el => {
            el.classList.remove('active-item');
          });
          topicItem.classList.add('active-item');
          
          const path = `${currentSemester}/${subject}/${unit}/${topic}`;
          loadNote(path);
        };
        topicList.appendChild(topicItem);
      });
      
      unitDiv.appendChild(topicList);
      subjectSection.appendChild(unitDiv);
    }
    
    subjectsContainer.appendChild(subjectSection);
  }
  
  // Add subject selector event listener
  subjectSelector.addEventListener('change', function() {
    const selectedSubject = this.value;
    if (selectedSubject === '') {
      // Show all subjects
      document.querySelectorAll('.subject-section').forEach(section => {
        section.style.display = 'block';
      });
    } else {
      // Hide all subject sections
      document.querySelectorAll('.subject-section').forEach(section => {
        section.style.display = 'none';
      });
      
      // Show selected subject section
      const selectedSection = document.getElementById(`subject-${selectedSubject.replace(/\s+/g, '-')}`);
      if (selectedSection) {
        selectedSection.style.display = 'block';
      }
    }
  });
  
  // Add elements to the tree
  navTree.appendChild(subjectSelector);
  navTree.appendChild(subjectsContainer);

  // Add click handlers to expand/collapse unit headers
  document.querySelectorAll('.unit-header').forEach(header => {
    header.addEventListener('click', function() {
      this.classList.toggle('collapsed');
      const topicList = this.nextElementSibling;
      if (topicList) {
        topicList.classList.toggle('hidden');
      }
    });
  });
}

async function loadNote(filePath) {
  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error('Note not found');
    const md = await res.text();
    noteDisplay.innerHTML = marked.parse(md);
  } catch (err) {
    noteDisplay.innerHTML = `<p style="color:red;">Failed to load note: ${filePath}</p>`;
  }
}

// Function to change the current semester
function changeSemester(semester) {
  if (structure[semester]) {
    currentSemester = semester;
    createTree();
    // Clear the note display
    noteDisplay.innerHTML = '<p>Select a note to view it here.</p>';
  }
}

// Add event listeners to semester links
document.addEventListener('DOMContentLoaded', function() {
  const semesterLinks = document.querySelectorAll('.nav-link[data-semester]');
  semesterLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const semester = this.getAttribute('data-semester');
      changeSemester(semester);
      
      // Update active state in navbar
      semesterLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Set the first semester as active by default
  semesterLinks[0].classList.add('active');
  
  // Initialize the tree
  createTree();
});
