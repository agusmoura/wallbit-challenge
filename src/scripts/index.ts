// Tipos

interface WindowManager {
  createWindow: (options: WindowOptions) => void;
  minimizeWindow: (id: string) => void;
  showMessageBox: (options: MessageBoxOptions) => void;
  openDesktopIcon: (id: string) => void;
}

interface WindowOptions {
  title: string;
  content: string;
  // ... más opciones
}

interface MessageBoxOptions {
  type?: "info" | "error" | "warning";
  title?: string;
  content: string;
  button?: string;
  link?: string;
}

// Implementación
class Win98Manager implements WindowManager {
  constructor() {
    // Agregar event listeners a los iconos de la taskbar
    document.querySelectorAll(".tray-icon").forEach((icon) => {
      icon.addEventListener("click", (e) => {
        const target = e.target as HTMLImageElement;
        const message = target.dataset.message || "OK";
        const type = target.dataset.type || "info";
        const title = target.dataset.title || "Mensaje del sistema";
        const button = target.dataset.button || "Aceptar";
        const link = target.dataset.link || "";
        this.showMessageBox({
          type: type as "info" | "error" | "warning",
          title: title,
          content: message,
          button: button,
          link: link,
        });
      });
    });

    document.addEventListener("openWindow", ((e: CustomEvent) => {
      const id = e.detail.id;
      this.openDesktopIcon(id);
    }) as EventListener);

    document.addEventListener("showMessage", ((e: CustomEvent) => {
      this.showMessageBox(e.detail);
    }) as EventListener);

    // Initialize clock
    this.initializeClock();
  }

  private initializeClock() {
    const updateClock = () => {
      const now = new Date();

      // Update date
      const dateElement = document.getElementById("taskbar-date");
      if (dateElement) {
        dateElement.textContent = now.toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }

      // Update time
      const timeElement = document.getElementById("taskbar-time");
      if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    };

    // Update immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);
  }

  createWindow(options: WindowOptions) {
    console.log(options);
  }
  minimizeWindow(id: string) {
    console.log(id);
  }
  showMessageBox(options: MessageBoxOptions) {
    const messageBoxElement = document.createElement("div");
    const { type, title, content, button, link = "" } = options;

    console.log(options);
    messageBoxElement.innerHTML = `<message-box type="${type}" title="${title}" content="${content}" button="${button}" link="${link}"></message-box>`;
    document.body.appendChild(messageBoxElement.firstElementChild!);
  }
  openDesktopIcon(id: string) {
    switch (id) {
      case "computer":
        this.showMessageBox({
          type: "error",
          title: "Mi PC",
          content: "Aca iria mi pc",
          button: "SI TUVIERA UNA",
        });
        break;
      case "trash":
        window.open("https://x.com/", "_blank");
        break;
      case "tienda":
        const storeElement = document.createElement("div");
        storeElement.innerHTML = "<store-window></store-window>";
        document.body.appendChild(storeElement.firstElementChild!);
        break;
      case "products":
        const productElement = document.createElement("div");
        productElement.innerHTML = "<product-list></product-list>";
        document.body.appendChild(productElement.firstElementChild!);
        break;
      case "wallbit":
        window.open("https://wallbit.io/", "_blank");
        break;
      case "calculator":
        console.log(navigator.userAgent.toLowerCase());

        if (navigator.userAgent.toLowerCase().includes("win")) {
          window.open("Calculator:///", "_blank");
        } else {
          window.open("https://calculator.apps.chrome/", "_blank");
        }
        break;
      default:
        console.log(`No handler for icon: ${id}`);
    }
  }
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  const windowManager = new Win98Manager();
});
