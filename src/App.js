import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Gère la soumission de l'expression
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/calculate', {
        expression: expression,
      });

      setResult(response.data.result);
    } catch (err) {
      setError('Une erreur est survenue, vérifie l\'expression');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await axios.get('http://localhost:8000/export_csv', {
        responseType: 'blob',
      });
  
      // Créer un objet URL pour le fichier
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Créer un lien et simuler un clic pour télécharger le fichier
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'operations.csv');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      setError('Erreur lors de l\'exportation du fichier CSV');
    }
  };
  

  return (
    <div className="App">
      <h1>Calculatrice</h1>
      <input
        type="text"
        placeholder="Entrez une expression"
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Calcul...' : 'Calculer'}
      </button>
      <button onClick={handleExportCSV}>
           Exporter CSV
      </button>


      {result !== null && (
        <div>
          <h2>Résultat : {result}</h2>
        </div>
      )}

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
    
  );
}

export default App;

