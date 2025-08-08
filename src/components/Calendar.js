import React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Calendar(props) {
  const baseButtonStyle = {
    height: "28px",
    width: "28px",
    backgroundColor: "transparent",
    border: "1px solid #ccc",
    padding: 0,
    opacity: 0.5,
    cursor: "pointer",
  };

  const selectedDayStyle = {
    backgroundColor: "#007bff",
    color: "#fff",
  };

  return (
    <DayPicker
      showOutsideDays
      classNames={{
        months: "",
        month: "",
        caption: "",
        caption_label: { fontSize: "14px", fontWeight: 500 },
        nav: { display: "flex", gap: "8px", alignItems: "center" },
        nav_button: baseButtonStyle,
        nav_button_previous: { position: "absolute", left: "8px" },
        nav_button_next: { position: "absolute", right: "8px" },
        table: { width: "100%", borderCollapse: "collapse" },
        head_row: { display: "flex" },
        head_cell: {
          width: "32px",
          fontSize: "12px",
          color: "#888",
          textAlign: "center",
        },
        row: { display: "flex", marginTop: "8px" },
        cell: {
          textAlign: "center",
          width: "32px",
          height: "32px",
          lineHeight: "32px",
        },
        day: {
          border: "none",
          background: "none",
          width: "32px",
          height: "32px",
          lineHeight: "32px",
          textAlign: "center",
          cursor: "pointer",
        },
        day_selected: selectedDayStyle,
        day_today: { backgroundColor: "#f0f0f0" },
        day_outside: { color: "#ccc" },
        day_disabled: { color: "#ccc", opacity: 0.5 },
      }}
      components={{
        IconLeft: (props) => (
          <ChevronLeft size={16} style={{ verticalAlign: "middle" }} />
        ),
        IconRight: (props) => (
          <ChevronRight size={16} style={{ verticalAlign: "middle" }} />
        ),
      }}
      {...props}
    />
  );
}


