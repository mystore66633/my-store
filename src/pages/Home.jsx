
import Hero from "../components/Hero";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      
      <Hero />

      <div
        style={{
          padding: "40px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2>🍳 Kitchen</h2>
          <p>Best kitchen products at affordable prices.</p>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2>🏠 Home</h2>
          <p>Decorate your home with amazing products.</p>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2>💻 Electronics</h2>
          <p>Latest gadgets and accessories.</p>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2>👕 Fashion</h2>
          <p>Trending fashion for everyone.</p>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Home;
