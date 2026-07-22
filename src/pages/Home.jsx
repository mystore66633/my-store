import Hero from "../components/Hero";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Hero />

      <div
        style={{
          padding: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {[
          {
            icon: "🍳",
            title: "Kitchen",
            text: "Best kitchen products at affordable prices.",
          },
          {
            icon: "🏠",
            title: "Home",
            text: "Decorate your home with amazing products.",
          },
          {
            icon: "💻",
            title: "Electronics",
            text: "Latest gadgets and accessories.",
          },
          {
            icon: "👕",
            title: "Fashion",
            text: "Trending fashion for everyone.",
          },
        ].map((item) => (
          <div
            key={item.title}
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: "32px", marginBottom: "10px" }}>
              {item.icon}
            </h2>

            <h3>{item.title}</h3>

            <p>{item.text}</p>
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
}

export default Home;