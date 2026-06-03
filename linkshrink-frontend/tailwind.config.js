/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        body: ["Space Grotesk", "sans-serif"]
      },
      colors: {
        void: "#050712",
        orbit: "#0B1026",
        nebula: "#151A3D",
        plasma: "#FF38D1",
        cyan: "#20F7FF",
        ion: "#92FE9D",
        starlight: "#EAF7FF",
        comet: "#8EA4C8"
      },
      boxShadow: {
        neon: "0 0 24px rgba(32, 247, 255, 0.45)",
        magenta: "0 0 30px rgba(255, 56, 209, 0.35)",
        glass: "inset 0 1px 0 rgba(255,255,255,0.18), 0 24px 80px rgba(0,0,0,0.38)"
      },
      backgroundImage: {
        "nebula-radial":
          "radial-gradient(circle at 20% 20%, rgba(255,56,209,0.28), transparent 28%), radial-gradient(circle at 80% 0%, rgba(32,247,255,0.24), transparent 30%), radial-gradient(circle at 50% 80%, rgba(146,254,157,0.12), transparent 34%), linear-gradient(135deg, #050712 0%, #0B1026 46%, #151A3D 100%)",
        "glass-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))"
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
        rise: "rise 650ms ease both"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.55", filter: "blur(16px)" },
          "50%": { opacity: "0.95", filter: "blur(24px)" }
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(18px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" }
        }
      }
    }
  },
  plugins: []
};
