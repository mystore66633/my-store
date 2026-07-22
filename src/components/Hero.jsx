function Hero() {
  return (
    <section
      style={{
        background: "linear-gradient(135deg,#1976d2,#42a5f5)",
        color: "#fff",
        padding: "60px 20px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(32px, 6vw, 48px)",
          marginBottom: "20px",
          lineHeight: "1.2",
        }}
      >
        Welcome to Nishan
      </h1>

      <p
        style={{
          fontSize: "clamp(16px, 3vw, 20px)",
          marginBottom: "30px",
        }}
      >
        Kitchen • Home • Electronics • Fashion
      </p>

      <button
        style={{
          padding: "15px 35px",
          border: "none",
          borderRadius: "8px",
          fontSize: "18px",
          cursor: "pointer",
          background: "#fff",
          color: "#1976d2",
          fontWeight: "bold",
          maxWidth: "250px",
          width: "100%",
        }}
      >
        Shop Now
      </button>
    </section>
  );
}

export default Hero;