import {
  ImageResponse,
} from "next/og";
import { site } from "@/content/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType =
  "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection:
            "column",
          justifyContent:
            "space-between",
          background:
            "#0F1B2A",
          color:
            "#E0E1DC",
          padding:
            "72px 82px",
          fontFamily:
            "Arial, sans-serif",
          position:
            "relative",
          overflow:
            "hidden",
        }}
      >
        <div
          style={{
            position:
              "absolute",
            right: "-120px",
            top: "-160px",
            width: "600px",
            height: "600px",
            border:
              "1px solid rgba(121,141,168,0.28)",
            borderRadius:
              "50%",
            display:
              "flex",
          }}
        />

        <div
          style={{
            position:
              "absolute",
            right: "80px",
            top: "145px",
            width: "260px",
            height: "260px",
            border:
              "1px solid rgba(67,90,118,0.55)",
            transform:
              "rotate(45deg)",
            display:
              "flex",
          }}
        />

        <div
          style={{
            display:
              "flex",
            alignItems:
              "baseline",
            gap: "14px",
          }}
        >
          <span
            style={{
              fontSize:
                "42px",
              fontWeight:
                700,
              letterSpacing:
                "-1.5px",
            }}
          >
            Virtus
          </span>

          <span
            style={{
              fontSize:
                "19px",
              fontWeight:
                600,
              letterSpacing:
                "4px",
              textTransform:
                "uppercase",
              color:
                "#798DA8",
            }}
          >
            Lab
          </span>
        </div>

        <div
          style={{
            display:
              "flex",
            flexDirection:
              "column",
            maxWidth:
              "850px",
          }}
        >
          <span
            style={{
              fontSize:
                "17px",
              fontWeight:
                600,
              letterSpacing:
                "4px",
              textTransform:
                "uppercase",
              color:
                "#798DA8",
              marginBottom:
                "22px",
            }}
          >
            Independent digital studio
          </span>

          <span
            style={{
              fontSize:
                "68px",
              lineHeight:
                1.02,
              letterSpacing:
                "-3px",
              fontWeight:
                600,
            }}
          >
            {site.tagline}
          </span>
        </div>

        <div
          style={{
            display:
              "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            borderTop:
              "1px solid rgba(121,141,168,0.36)",
            paddingTop:
              "22px",
            color:
              "#798DA8",
            fontSize:
              "17px",
          }}
        >
          <span>
            Brand · Web · Content · Automation
          </span>

          <span>
            Manila → Worldwide
          </span>
        </div>
      </div>
    ),
    size,
  );
}
