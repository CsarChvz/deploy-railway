"use client";

import { useState } from "react";
import styles from "./CircleCalculator.module.css";

interface Circle {
  id: number;
  value: string;
}

export default function CircleCalculator() {
  const [circles, setCircles] = useState<Circle[]>([
    { id: 1, value: "" },
    { id: 2, value: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const addCircle = () => {
    if (circles.length < 5) {
      const newId = Math.max(...circles.map((c) => c.id)) + 1;
      setCircles([...circles, { id: newId, value: "" }]);
    }
  };

  const removeCircle = (id: number) => {
    if (circles.length > 2) {
      setCircles(circles.filter((c) => c.id !== id));
    }
  };

  const handleChange = (id: number, value: string) => {
    setCircles(circles.map((c) => (c.id === id ? { ...c, value } : c)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const validRadii = circles
        .map((c) => parseFloat(c.value))
        .filter((r) => !isNaN(r) && r > 0);

      if (validRadii.length < 2) {
        throw new Error("Please enter at least 2 valid radii");
      }

      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ radii: validRadii }),
      });

      if (!response.ok) {
        throw new Error("Failed to calculate circle arrangement");
      }

      const data = await response.json();
      setResult(data.image);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleNewCircle = () => {
    setCircles([
      { id: 1, value: "" },
      { id: 2, value: "" },
    ]);
    setResult(null);
    setError(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Problema de los círculos adyacentes</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.circleInputs}>
          {circles.map(({ id, value }) => (
            <div key={id} className={styles.inputGroup}>
              <label htmlFor={`circle-${id}`} className={styles.label}>
                Radio del círculo {id}
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id={`circle-${id}`}
                  type="number"
                  value={value}
                  onChange={(e) => handleChange(id, e.target.value)}
                  min="0.1"
                  step="0.1"
                  required
                  className={styles.input}
                  placeholder="Ingrese el radio"
                />
                {circles.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeCircle(id)}
                    className={styles.removeButton}
                    aria-label="Eliminar círculo"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.buttonGroup}>
          {circles.length < 5 && (
            <button
              type="button"
              onClick={addCircle}
              className={styles.addButton}
            >
              Agregar círculo
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={styles.calculateButton}
          >
            {loading ? "Calculando..." : "Calcular"}
          </button>
        </div>
      </form>

      {error && (
        <div className={styles.error}>
          {error}
          <button
            onClick={() => setError(null)}
            className={styles.closeError}
            aria-label="Cerrar mensaje de error"
          >
            ×
          </button>
        </div>
      )}

      {result && (
        <div className={styles.result}>
          <h2>Resultado</h2>
          <div className={styles.imageWrapper}>
            <img
              src={`data:image/png;base64,${result}`}
              alt="Visualización de disposición de círculos"
              className={styles.resultImage}
            />
          </div>
          <button
            type="button"
            onClick={handleNewCircle}
            className={styles.addButton}
          >
            Nuevo círculo
          </button>
        </div>
      )}
    </div>
  );
}
