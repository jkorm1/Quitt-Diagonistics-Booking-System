"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export const AnimatedSection = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.16,
            delayChildren: 0.25,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    }}
  >
    {children}
  </motion.div>
);

export const CarAnimation = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ x: "100%", opacity: 0 }}
      animate={isInView ? { x: 0, opacity: 1 } : { x: "10%", opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="relative w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export const FlipCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      className={`perspective-1000 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="relative w-full h-full transform-style-3d transition-transform duration-700"
        whileHover={{ rotateY: 180 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export const CardFace = ({
  children,
  className = "",
  isBack = false,
}: {
  children: React.ReactNode;
  className?: string;
  isBack?: boolean;
}) => {
  return (
    <motion.div
      className={`absolute inset-0 w-full h-full backface-hidden ${className}`}
      style={{ backfaceVisibility: "hidden" }}
      initial={{ rotateY: isBack ? 180 : 0 }}
    >
      {children}
    </motion.div>
  );
};

// ─── Services Showcase ────────────────────────────────────────────────────────

interface ServiceItem {
  title: string;
  tag: string;
  desc: string;
  items: string[];
  icon: React.ElementType;
  dir: "left" | "right";
  imgGrad: [string, string];
  accent: string;
  iconBg: string;
  iconColor: string;
  revBg: string;
  shape: "circle" | "ring" | "cross";
}

function CornerShape({
  shape,
  accent,
}: {
  shape: ServiceItem["shape"];
  accent: string;
}) {
  const a22 = `${accent}22`;
  const a18 = `${accent}18`;
  const a30 = `${accent}30`;
  const a55 = `${accent}55`;
  const a33 = `${accent}33`;
  const a44 = `${accent}44`;
  const a25 = `${accent}25`;

  if (shape === "ring")
    return (
      <svg
        viewBox="0 0 130 130"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <circle
          cx="65"
          cy="65"
          r="55"
          fill="none"
          stroke={a55}
          strokeWidth="8"
        />
        <circle
          cx="65"
          cy="65"
          r="40"
          fill="none"
          stroke={a33}
          strokeWidth="4"
        />
        <circle cx="65" cy="65" r="25" fill={a22} />
      </svg>
    );
  if (shape === "cross")
    return (
      <svg
        viewBox="0 0 130 130"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <line
          x1="65"
          y1="10"
          x2="65"
          y2="120"
          stroke={a44}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1="10"
          y1="65"
          x2="120"
          y2="65"
          stroke={a44}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="65" cy="65" r="20" fill={a25} />
      </svg>
    );
  return (
    <svg
      viewBox="0 0 130 130"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <circle cx="65" cy="65" r="55" fill={a22} stroke={a44} strokeWidth="2" />
      <circle cx="65" cy="65" r="35" fill={a18} />
      <circle cx="65" cy="65" r="18" fill={a30} />
    </svg>
  );
}

function ServiceCard({ service }: { service: ServiceItem }) {
  const [hovered, setHovered] = useState(false);
  const {
    title,
    tag,
    desc,
    items,
    icon: Icon,
    dir,
    imgGrad,
    accent,
    iconBg,
    iconColor,
    revBg,
    shape,
  } = service;

  // The inner track is 200% wide. Both panels are 50% (= 100% of card).
  // On hover we shift the track by -50% (left) or +50% (right) so the image
  // slides OUT and the reveal slides IN simultaneously — true SimplyBook swap.
  const trackStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: dir === "right" ? "row-reverse" : "row",
    width: "200%",
    height: "100%",
    transform: hovered
      ? dir === "left"
        ? "translateX(-50%)"
        : "translateX(50%)"
      : "translateX(0)",
    transition: "transform 0.52s cubic-bezier(0.77,0,0.175,1)",
  };

  const panelStyle: React.CSSProperties = {
    flex: "0 0 50%",
    height: "100%",
    position: "relative",
    overflow: "hidden",
  };

  return (
    <div
      style={{
        position: "relative",
        height: "300px",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={trackStyle}>
        {/* Image panel */}
        <div style={panelStyle}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse at 35% 35%, ${imgGrad[0]} 0%, ${imgGrad[1]} 100%)`,
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.55s ease",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(2,15,40,0.75) 0%, rgba(2,15,40,0.1) 55%, transparent 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "22px 24px",
              zIndex: 2,
            }}
          >
            <h3
              style={{
                color: "#fff",
                fontSize: "18px",
                fontWeight: 500,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {title}
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginTop: "5px",
              }}
            >
              {tag}
            </p>
          </div>
        </div>

        {/* Reveal panel */}
        <div
          style={{
            ...panelStyle,
            background: revBg,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "28px 26px 26px",
          }}
        >
          {/* Top accent bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: accent,
            }}
          />

          {/* Corner shape — overflows top, clipped by parent overflow:hidden */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-28px",
              right: "-18px",
              width: "130px",
              height: "130px",
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            <CornerShape shape={shape} accent={accent} />
          </div>

          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "12px",
              background: iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "14px",
              flexShrink: 0,
              position: "relative",
              zIndex: 2,
            }}
          >
            <Icon style={{ width: "22px", height: "22px", color: iconColor }} />
          </div>

          <p
            style={{
              color: "#fff",
              fontSize: "17px",
              fontWeight: 500,
              marginBottom: "8px",
              position: "relative",
              zIndex: 2,
            }}
          >
            {title}
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.72)",
              fontSize: "13px",
              lineHeight: 1.65,
              marginBottom: "14px",
              position: "relative",
              zIndex: 2,
            }}
          >
            {desc}
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              position: "relative",
              zIndex: 2,
            }}
          >
            {items.map((item, i) => (
              <li
                key={i}
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                }}
              >
                <span
                  style={{
                    color: accent,
                    fontSize: "14px",
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export const ServicesShowcase = ({ services }: { services: ServiceItem[] }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(2, 300px)",
        width: "100%",
        gap: 0,
      }}
    >
      {services.map((service, i) => (
        <motion.div
          key={service.title}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.55, delay: i * 0.07, ease: "easeOut" }}
        >
          <ServiceCard service={service} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export type { ServiceItem };
