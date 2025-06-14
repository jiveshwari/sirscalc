import { useState, FormEvent } from 'react';
import './SymptomForm.css';

interface FormData {
  name: string;
  temperature: string;
  symptoms: string;
}

interface SIRSResult {
  criteriaMet: number;
  message: string;
}

function SymptomForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    temperature: '',
    symptoms: '',
  });
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<SIRSResult | null>(null);

  const analyzeSymptoms = (data: FormData): SIRSResult => {
    let criteriaMet = 0;
    let message = '';

    // SIRS Criterion 1: Temperature >38°C or <36°C
    const temp = Number(data.temperature);
    if (temp > 38 || temp < 36) {
      criteriaMet++;
      message += 'Abnormal temperature detected. ';
    }

    // SIRS Criterion 2: Check for keywords indicating infection (simplified)
    const symptomsLower = data.symptoms.toLowerCase();
    const infectionKeywords = ['fever', 'chills', 'cough', 'infection'];
    if (symptomsLower.includes('fever') || symptomsLower.includes('chills')) {
      criteriaMet++;
      message += 'Symptoms suggest possible infection. ';
    }

    // SIRS Result
    if (criteriaMet >= 2) {
      message = `Potential SIRS: ${criteriaMet} criteria met. ${message}Consult a healthcare professional.`;
    } else {
      message = `No SIRS detected: ${criteriaMet} criteria met. ${message}`;
    }

    return { criteriaMet, message };
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || isNaN(Number(formData.temperature)) || Number(formData.temperature) < 0) {
      setError('Please fill all fields with valid data (temperature must be a positive number).');
      setResult(null);
      return;
    }
    setError('');
    const analysis = analyzeSymptoms(formData);
    setResult(analysis);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">SIRS Symptom Checker</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name:</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            type="text"
            placeholder="Enter patient name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Temperature (°C):</label>
          <input
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            type="number"
            placeholder="Enter temperature"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Symptoms:</label>
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            placeholder="Describe symptoms (e.g., fever, chills)"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Analyze Symptoms
        </button>
      </form>
      {result && (
        <div className="mt-4 p-4 border rounded">
          <p className={result.criteriaMet >= 2 ? 'text-red-500' : 'text-green-500'}>
            {result.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default SymptomForm;