import React from "react";
import "../styles/logo.css";  // so it reuses the same styles
export default function PrimeroLogo({
    size = "lg",
    mono = false,
    className = "",
    as: Tag = "h1",
    ariaLabel = "PRIMERO",
}) {
    const classes = [
        "tanda-logo",
        `tanda-logo--${size}`,
        mono ? "tanda-logo--mono" : "",
        className
    ].filter(Boolean).join(" ");

    return (
        <Tag className={classes} aria-label={ariaLabel}>
            <span className="p">P</span>
            <span className="r">R</span>
            <span className="i">I</span>
            <span className="m">M</span>
            <span className="e">E</span>
            <span className="r2">R</span>
            <span className="o">O</span>
        </Tag>
    );
}