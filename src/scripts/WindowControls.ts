interface WindowStyles {
  width: string;
  height: string;
  top: string;
  left: string;
  transform: string;
  display: string;
}

export class WindowControls {
  private window: HTMLElement;
  private dragHandle: HTMLElement;
  private minimizeBtn: HTMLElement | null;
  private maximizeBtn: HTMLElement | null;
  private closeBtn: HTMLElement | null;
  private resizeHandle: HTMLElement;
  private taskbarItem: HTMLElement;
  private isMaximized: boolean = false;
  private isDragging: boolean = false;
  private isResizing: boolean = false;
  private originalStyles: WindowStyles;
  private initialX = 0;
  private initialY = 0;
  private currentX = 0;
  private currentY = 0;
  private static topZIndex: number = 1000;

  constructor(windowElement: HTMLElement, taskbarItem: HTMLElement) {
    this.window = windowElement;
    this.dragHandle = windowElement.querySelector("#dragHandle") as HTMLElement;
    this.minimizeBtn = windowElement.querySelector("#minimizeBtn");
    this.maximizeBtn = windowElement.querySelector("#maximizeBtn");
    this.closeBtn = windowElement.querySelector("#closeBtn");
    this.resizeHandle = windowElement.querySelector(".resize-handle") as HTMLElement;
    this.taskbarItem = taskbarItem;

    this.originalStyles = {
      width: "600px",
      height: "auto",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      display: "block",
    };

    WindowControls.topZIndex += 1;
    this.window.style.zIndex = WindowControls.topZIndex.toString();

    this.initializeControls();
    this.window.addEventListener("mousedown", () => {
      this.bringToFront();
    });
  }

  private initializeControls(): void {
    this.initializeDrag();
    this.initializeResize();
    this.initializeButtons();
  }

  private initializeDrag(): void {
    this.dragHandle.addEventListener("mousedown", (e) => {
      this.isDragging = true;

      // Get the current window position
      const rect = this.window.getBoundingClientRect();
      this.currentX = rect.left;
      this.currentY = rect.top;

      // Calculate the mouse offset within the window
      this.initialX = e.clientX - this.currentX;
      this.initialY = e.clientY - this.currentY;

      // Add temporary event listeners
      document.addEventListener("mousemove", this.handleDrag);
      document.addEventListener("mouseup", this.handleDragEnd);
    });
  }

  private handleDrag = (e: MouseEvent) => {
    if (!this.isDragging) return;

    e.preventDefault();

    // Calculate new position
    const newX = e.clientX - this.initialX;
    const newY = e.clientY - this.initialY;

    // Update window position
    this.window.style.left = `${newX}px`;
    this.window.style.top = `${newY}px`;
    this.window.style.transform = "none"; // Remove the translate(-50%, -50%)
  };

  private handleDragEnd = () => {
    this.isDragging = false;
    document.removeEventListener("mousemove", this.handleDrag);
    document.removeEventListener("mouseup", this.handleDragEnd);
  };

  private initializeResize(): void {
    let originalWidth: number;
    let originalHeight: number;
    let originalX: number;
    let originalY: number;

    this.resizeHandle.addEventListener("mousedown", (e: MouseEvent) => {
      this.isResizing = true;
      originalWidth = this.window.offsetWidth;
      originalHeight = this.window.offsetHeight;
      originalX = e.clientX;
      originalY = e.clientY;
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e: MouseEvent) => {
      if (this.isResizing) {
        const width = originalWidth + (e.clientX - originalX);
        const height = originalHeight + (e.clientY - originalY);

        if (width >= 400) this.window.style.width = `${width}px`;
        if (height >= 300) this.window.style.height = `${height}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      this.isResizing = false;
    });
  }

  private initializeButtons(): void {
    this.minimizeBtn?.addEventListener("click", () => {
      this.window.style.display = "none";
      this.taskbarItem.classList.remove("active");
    });

    this.maximizeBtn?.addEventListener("click", () => {
      if (!this.isMaximized) {
        this.originalStyles = {
          width: this.window.style.width,
          height: this.window.style.height,
          top: this.window.style.top,
          left: this.window.style.left,
          transform: this.window.style.transform,
          display: this.window.style.display,
        };

        this.window.style.width = "100%";
        this.window.style.height = "100%";
        this.window.style.top = "0";
        this.window.style.left = "0";
        this.window.style.transform = "none";
      } else {
        Object.assign(this.window.style, this.originalStyles);
      }
      this.isMaximized = !this.isMaximized;
    });

    this.closeBtn?.addEventListener("click", () => {
      this.window.remove();
      this.taskbarItem.remove();
    });

    this.taskbarItem.addEventListener("click", () => {
      this.window.style.display = "block";
      this.taskbarItem.classList.add("active");
      this.bringToFront();
    });
  }

  private bringToFront(): void {
    WindowControls.topZIndex += 1;
    this.window.style.zIndex = WindowControls.topZIndex.toString();
  }
}
