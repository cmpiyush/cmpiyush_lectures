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
        "History of Social Work.md",
        "Social work profession as a change agent.md",
        "Social Work in India- Historical Perspective.md",
        "Social service and reform tradition in India.md",
        "Hindu reforms movements.md"
      ],
      "Unit 3": [
        "Attributes of a profession.md",
        "Attributes of a professional social worker.md",
        "Role and functions of social work profession.md",
        "Professional Code of Ethics.md",
        " Challenges of Social Work as a Profession.md",
        " Interface between Professional and Voluntary Social Work.md"
      ],
      "Unit 4": [
        "Units of social work intervention and dynamics.md",
        "Individual and Family.md",
        "Group, organizations and communities.md",
      ],
      "Unit 5": [
        "Neo-liberalism and globalization.md",
        "Post modernism.md",
        "Feminism.md",
        "Resurgence of civil society.md",
        "Ideology of Non-Government organization.md"
      ]
    },
    "MSW 102": {
      "Unit 1": [
        "Society as a system of relationship, Social Structure and Social Processes.md",
      ],
      "Unit 2": [
        "Socialization- Meaning, process and significance.md",
        "Social Institutions- Meaning, characteristics and types.md",
        "Social Stratification- Meaning, characteristics and types.md"
      ],
      "Unit 3": [
        "Society and Culture.md",
        "Social Control- Meaning, concept and agencies, characteristics and types.md",
        "Social Problems- Meaning, characteristics and types.md"
      ],
      "Unit 4":[
        "Theories of Society.md",
        "Indian Society.md"
      ],
      "Unit 5": [
        "Social change.md",
        "Social change process in India"
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
      ],
      "Unit 3": [
        "Research Design - Meaning and Types",
        "Scaling method - Bogardus & Likert",
        "Tools of data collections",
        "Observation, interview and case study",
        "Sources of data: Primary and Secondary"
      ],
      "Unit 4": [
        "Statistics-Meaning, Signification, Uses and limitations",
        "Diagrammatic representation of data.md",
        "Measures of Central Tendencies- Mean, Median and Mode",
        "Measures of Dispersion- Range, Interquartile Range, Standard Deviation, Variance",
        "Chi-Square Test.md",
        "Co-efficient of correlation, Karl Pearson and Spearman’s rank correlation",
        "Regression Analysis.md",
        "Use of computer and internet in social work practice.md"
      ],
      "Unit 5": [
        "Writing a research report",
        "Social Work research report content and formats",
        "Literature Review and Literature Survey",
        "Problem Identification.md",
        "Specification of Research Questions.md",
        "Rationale and Study Objectives.md",
        "Operational definitions",
        "Research Methodology.md",
        "Research Design.md",
        "Data Collection and Analysis.md",
        "Interpretation of results and discussion.md",
        "Conclusion.md",
        "References.md"
      ]
    }
  },
  "Semester 2": {
    "MSW 201": {
      "Unit 1": ["Community Organization.md"]
    }
  },
  "Semester 3": {
    "MSW 313": {
      "Unit 1": [
        "Demography and Population.md",
        "Sources of Demographic Data.md",
        "Population Growth and its Consequences.md",
        "Population Policy and Programmes.md"
      ],
      "Unit 2": [
        "Determinants of population growth.md",
        "Theories of population",
        "Population Control Measures.md",

      ],
      "Unit 3": [
        "Characteristics of Indian Population.md",
        "Population Composition and Distribution in India.md",
        "Population and Development in India.md",
      ],
      "Unit 4": [
        "Population growth and population policy in India.md",
        "National Population policy.md",
        "Family planning in India.md",
        "Role of social worker in family planning.md"
      ],
      "Unit 5": [
        "Population education.md",
        "population education in educational institutions.md",
        "social work practice and population education.md"
      ]
    },
  },
  "Semester 4": {
    "MSW 401": {
      "Unit 1": ["Example Note 1.md"]
    }
  }
};

let currentSemester = "Semester 1";
const navTree = document.getElementById('nav-tree'), noteDisplay = document.getElementById('note-display');

function createTree() {
  navTree.innerHTML = '';
  document.getElementById('current-semester').textContent = currentSemester;
  
  for (let subject in structure[currentSemester]) {
    const subjectDiv = document.createElement('div');
    subjectDiv.innerHTML = `<div class="subject-header" onclick="this.classList.toggle('collapsed');this.nextElementSibling.classList.toggle('hidden')">${subject}</div><div class="units-container">`;
    
    for (let unit in structure[currentSemester][subject]) {
      const unitDiv = document.createElement('div');
      unitDiv.innerHTML = `<div class="unit-header" onclick="this.classList.toggle('collapsed');this.nextElementSibling.classList.toggle('hidden')">${unit}</div><div class="topic-list">`;
      
      structure[currentSemester][subject][unit].forEach(topic => {
        const topicDiv = document.createElement('div');
        topicDiv.className = 'topic-item';
        topicDiv.textContent = topic.replace('.md', '');
        topicDiv.onclick = () => {
          document.querySelectorAll('.active-item').forEach(el => el.classList.remove('active-item'));
          topicDiv.classList.add('active-item');
          currentSubject = subject; currentUnit = unit; currentTopic = topic;
          loadNote(`${currentSemester}/${subject}/${unit}/${topic}`);
        };
        unitDiv.lastElementChild.appendChild(topicDiv);
      });
      
      subjectDiv.lastElementChild.appendChild(unitDiv);
    }
    
    subjectDiv.innerHTML += '</div>';
    navTree.appendChild(subjectDiv);
  }
}

async function loadNote(filePath) {
  try {
    const res = await fetch(filePath);
    noteDisplay.innerHTML = res.ok ? marked.parse(await res.text()) : `<p style="color:red">Failed to load: ${filePath}</p>`;
  } catch (err) {
    noteDisplay.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-semester]').forEach((link, i) => {
    link.onclick = e => {
      e.preventDefault();
      currentSemester = link.dataset.semester;
      createTree();
      noteDisplay.innerHTML = '<p>Select a note to view it here.</p>';
      document.querySelectorAll('[data-semester]').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    };
    if (i === 0) link.classList.add('active');
  });
  createTree();
});

// Feedback form
document.getElementById('feedback-btn').onclick = () => {
  const form = document.getElementById('feedback-form');
  document.getElementById('fb-sem').value = currentSemester;
  document.getElementById('fb-subj').value = currentSubject;
  document.getElementById('fb-unit').value = currentUnit;
  document.getElementById('fb-topic').value = currentTopic;
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
};

