# [SIRS Criteria Calculator](https://sirscalc.vercel.app/) 

## Jiveshwari's Contribution Details - SIRS Calculator (Fork)

A React-based web app for calculating SIRS criteria to aid sepsis detection in healthcare. I forked this project to explore its potential for intuitive UI enhancements, aligning with my interest in medical applications of AI.

## My Contribution 
- Pushed in branch: symptom-form-integration
- Built a TypeScript-based React form to collect name, temperature, heart rate, and symptoms with validation.
- Added SIRS analysis for temperature (>38°C or <36°C), heart rate (>90 beats/min), and symptom keywords (e.g., fever, chills).
- Shows colour-coded results (red for SIRS risk, green for no risk).

## Features

- Real-time SIRS Calculation: Instantly checks if SIRS criteria are met based on user input.
- Detailed Criteria Breakdown: Displays which criteria (temperature, heart rate, symptoms) triggered SIRS risk.
- User-friendly Interface: Clean, intuitive React form for quick data entry.
- Mobile Responsive: Responsive design for use on any device.
- Input Validation: Ensures valid data (non-empty name, positive numbers for temperature and heart rate).

## Tech Stack

- Frontend: React, TypeScript, HTML, CSS
- Architecture: Component-based architecture with React hooks
- Deployment: Local development with Create React App

### My Contribution Attempt One
- **Goal**: Planned to add a color-coded risk indicator for better usability.
- **Challenges**: Encountered issues with the codebase (e.g., broken dependencies, inconsistent functionality on local and official sites).
- **Outcome**: Due to time constraints, I documented my approach instead of fully implementing changes. Screenshots below are from the original README, showcasing the intended UI.

### Screenshots
<a href="https://sirscalc.vercel.app/"><img src="https://raw.githubusercontent.com/iterating/sirscalc/refs/heads/main/public/portfolio.sirscalc.calc.jpg" width="350px"><img src="https://raw.githubusercontent.com/iterating/sirscalc/refs/heads/main/public/portfolio.sirscalc.hl7-fhir-export.jpg" width="350px"></a>

## Future Plans
With more time, I’d debug dependencies and integrate AI-driven risk prediction, leveraging my experience with AWS Bedrock from my RAG project.

## Author's Contribution
[![SIRS Criteria Calculator](https://raw.githubusercontent.com/iterating/sirscalc/refs/heads/main/public/portfolio.sirscalc.qr.png)](https://sirscalc.vercel.app/)
**Try it out!**

The author wrote this as a medical student at University of Massachusetts Medical School to lessen cognitive load and improve accuracy while seeing patients in the clinics. 

### What is SIRS?

Systemic Inflammatory Response Syndrome (SIRS) is a serious clinical condition that represents a body-wide inflammatory state. It is often a precursor to sepsis, a life-threatening condition that requires immediate medical attention. A patient is considered to have SIRS when they meet two or more of the following criteria:

- Temperature > 38.0°C (100.4°F) or < 36.0°C (96.8°F)
- Heart rate > 90 beats/minute
- Respiratory rate > 20 breaths/minute
- White blood cell count > 12,000/mm³ or < 4,000/mm³

### Why is this Important?

Early detection of SIRS is crucial because:
- It can be an early warning sign of sepsis
- Quick intervention can significantly improve patient outcomes
- It helps standardize the assessment process
- It reduces the likelihood of missing critical cases
- It supports evidence-based medical decision making

### Previous Features

- **Real-time SIRS Calculation**: Instantly determine if SIRS criteria are met
- **Detailed Criteria Breakdown**: See which specific criteria were met
- **Calculation History**: Track and review previous calculations
- **User-friendly Interface**: Clean, intuitive design for rapid data entry
- **Mobile Responsive**: Use on any device at the bedside
- **Data Persistence**: Secure storage of calculations using Supabase
- **Health Data Interoperability**: Export results in FHIR and HL7 formats
  - FHIR: Export as FHIR Observation resources (JSON)
  - HL7: Export as HL7 v2.5.1 messages (Text)

### OLD - Tech Stack

- **Frontend**: Javascript, HTML, CSS
- **Backend**: Node.js with Express
- **Database**: Supabase (PostgreSQL)
- **Architecture**: Clean Architecture with Domain-Driven Design
- **Deployment**: Vercel for serverless deployment
- **Healthcare Standards**: FHIR R4, HL7 v2.5.1

### License

This project is licensed under the MIT License - see the LICENSE file for details.
