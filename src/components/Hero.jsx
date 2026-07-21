function Hero() {
  return (
    <section
      style={{
        background: "linear-gradient(135deg,#1976d2,#42a5f5)",
        color: "#fff",
        padding: "80px 30px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          marginBottom: "20px",
        }}
      >
        Welcome to My Store
      </h1>

      <p
        style={{
          fontSize: "20px",
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
        }}
      >
        Shop Now
      </button>
    </section>
  );
}

export default Hero;
