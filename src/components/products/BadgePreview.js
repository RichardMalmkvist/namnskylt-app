import { useEffect, useRef, useState } from "react";
import { getChosenProfession } from "../../data/professionHelpers";
import { isProfessionProductType } from "../../data/productHelpers";
import { PRODUCTS } from "../../data/products";

const NAME_BADGE_TEMPLATE_BY_BADGE_ID = {
  208: "/ftv tom.jpg",
  211: "/energikontor blank.jpg",
  212: "/energikontor blank.jpg",
};

const DEFAULT_NAME_BADGE_TEMPLATE_SRC = "/namnskylt-blank.jpg";

const DOOR_SIGN_TEMPLATE_BY_BADGE_ID = {
  601: "/art.-0601 tom.jpg",
  602: "/art.-0601 tom.jpg",
};

const DEFAULT_DOOR_SIGN_TEMPLATE_SRC = "/art.-0601 tom.jpg";

const HANGING_SIGN_ARROW_SRC = {
  left: "/pil-vänster.svg",
  right: "/pil-höger.svg",
  up: "/pil-upp.svg",
  down: "/pil-ner.svg",
};

const HANGING_SIGN_VARIANTS = {
  large: {
    template: "/pendlad-vit-tom.png",
    previewWidth: {
      form: 600,
      mini: 220,
    },
    base: {
      width: 700,
      height: 180,
    },
    textLayouts: {
      single: {
        line1: {
          left: 90,
          top: 62,
          width: 525,
          height: 82,
          startFontSize: 42,
          minFontSize: 18,
        },
      },
      double: {
        line1: {
          left: 90,
          top: 42,
          width: 525,
          height: 34,
          startFontSize: 28,
          minFontSize: 14,
        },
        line2: {
          left: 90,
          top: 84,
          width: 525,
          height: 34,
          startFontSize: 28,
          minFontSize: 14,
        },
      },
    },
    arrowLayouts: {
      left: {
        left: 30,
        right: "auto",
        top: 80,
        width: 44,
        height: 44,
      },
      right: {
        left: "auto",
        right: 30,
        top: 80,
        width: 44,
        height: 44,
      },
    },
    secondSignMarginTop: {
      form: -42,
      mini: -20,
    },
  },

  small: {
    template: "/pendlad-vit-liten-tom.png",
    previewWidth: {
      form: 520,
      mini: 200,
    },
    base: {
      width: 700,
      height: 180,
    },
    textLayouts: {
      single: {
        line1: {
          left: 90,
          top: 68,
          width: 525,
          height: 82,
          startFontSize: 42,
          minFontSize: 18,
        },
      },
      double: {
        line1: {
          left: 90,
          top: 42,
          width: 525,
          height: 34,
          startFontSize: 28,
          minFontSize: 14,
        },
        line2: {
          left: 90,
          top: 84,
          width: 525,
          height: 34,
          startFontSize: 28,
          minFontSize: 14,
        },
      },
    },
    arrowLayouts: {
      left: {
        left: 30,
        right: "auto",
        top: 85,
        width: 44,
        height: 44,
      },
      right: {
        left: "auto",
        right: 30,
        top: 85,
        width: 44,
        height: 44,
      },
    },
    secondSignMarginTop: {
      form: -42,
      mini: -20,
    },
  },

  xlarge: {
    template: "/pendlad-vit-stor-tom.png",
    previewWidth: {
      form: 520,
      mini: 200,
    },
    base: {
      width: 700,
      height: 180,
    },
    textLayouts: {
      single: {
        line1: {
          left: 90,
          top: 62,
          width: 525,
          height: 82,
          startFontSize: 42,
          minFontSize: 18,
        },
      },
      double: {
        line1: {
          left: 90,
          top: 55,
          width: 525,
          height: 34,
          startFontSize: 38,
          minFontSize: 14,
        },
        line2: {
          left: 90,
          top: 105,
          width: 525,
          height: 34,
          startFontSize: 38,
          minFontSize: 14,
        },
      },
    },
    arrowLayouts: {
      left: {
        left: 30,
        right: "auto",
        top: 50,
        width: 44,
        height: 44,
      },
      right: {
        left: "auto",
        right: 30,
        top: 50,
        width: 44,
        height: 44,
      },
    },
    secondSignMarginTop: {
      form: -20,
      mini: -8,
    },
  },
};

function getBadgeById(badgeId) {
  return PRODUCTS.find((product) => product.id === badgeId);
}

function getProfessionCardColors(color, textColor) {
  const normalizedColor = (color || "").toLowerCase();
  const normalizedTextColor = (textColor || "").toLowerCase();

  const backgroundMap = {
    röd: "#d62828",
    blå: "#2563eb",
    grön: "#2e7d32",
    orange: "#ef6c00",
    lila: "#7b1fa2",
    ljusblå: "#4fc3f7",
    vinröd: "#8e244d",
    svart: "#212121",
    vit: "#ffffff",
  };

  const background = backgroundMap[normalizedColor] || "#d62828";

  let colorValue = "#ffffff";

  if (normalizedTextColor === "svart") {
    colorValue = "#111111";
  }

  if (normalizedColor === "vit" && !normalizedTextColor) {
    colorValue = "#111111";
  }

  return {
    background,
    color: colorValue,
  };
}

function getMiniFieldOffset(badgeId, fieldKey) {
  const defaultOffsets = {
    name: -40,
    title: -85,
    titleLine2: -85,
    orgLine1: -55,
    orgLine2: -25,
  };

  const offsetsByBadgeId = {
    1: {
      name: -55,
      title: -140,
    },
    2: {
      name: -55,
      title: -140,
      orgLine1: -120,
    },
    3: {
      name: -55,
      title: -140,
      titleLine2: -140,
    },
    4: {
      name: -55,
      title: -140,
      orgLine1: -105,
      orgLine2: -75,
    },
    208: {
      name: -45,
      title: -140,
      orgLine1: -120,
    },
    211: {
      name: -55,
      title: -140,
    },
    212: {
      name: -55,
      title: -140,
      orgLine1: -120,
    },
  };

  const badgeOffsets = offsetsByBadgeId[badgeId] || defaultOffsets;
  return badgeOffsets[fieldKey] || 0;
}

function getMirroredPlacement(placement) {
  if (placement === "left") return "right";
  if (placement === "right") return "left";
  return "none";
}

function getMirroredDirection(direction) {
  if (direction === "left") return "right";
  if (direction === "right") return "left";
  return direction;
}

function getNameBadgeTemplateSrc(badgeId) {
  return (
    NAME_BADGE_TEMPLATE_BY_BADGE_ID[badgeId] || DEFAULT_NAME_BADGE_TEMPLATE_SRC
  );
}

function getDoorSignTemplateSrc(badgeId) {
  return (
    DOOR_SIGN_TEMPLATE_BY_BADGE_ID[badgeId] || DEFAULT_DOOR_SIGN_TEMPLATE_SRC
  );
}

function AutoFitText({
  text,
  maxWidth,
  startFontSize,
  minFontSize,
  fontWeight = 400,
  color = "#222",
  lineHeight = 1.05,
  style = {},
}) {
  const textRef = useRef(null);
  const [fontSize, setFontSize] = useState(startFontSize);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    let nextFontSize = startFontSize;
    element.style.fontSize = `${nextFontSize}px`;

    while (element.scrollWidth > maxWidth && nextFontSize > minFontSize) {
      nextFontSize -= 1;
      element.style.fontSize = `${nextFontSize}px`;
    }

    setFontSize(nextFontSize);
  }, [text, maxWidth, startFontSize, minFontSize]);

  return (
    <div
      ref={textRef}
      style={{
        fontSize,
        fontWeight,
        color,
        lineHeight,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {text}
    </div>
  );
}

function getNameBadgeLayout(badgeId) {
  const base = {
    width: 600,
    height: 240,

    name: {
      left: 32,
      top: 30,
      width: 390,
      startFontSize: 38,
      minFontSize: 18,
      fontWeight: 700,
      color: "#222",
    },

    title: {
      left: 36,
      top: 86,
      width: 300,
      startFontSize: 20,
      minFontSize: 12,
      fontWeight: 400,
      color: "#666",
    },

    titleLine2: {
      left: 36,
      top: 110,
      width: 300,
      startFontSize: 20,
      minFontSize: 12,
      fontWeight: 400,
      color: "#666",
    },

    orgLine1: {
      left: 36,
      top: 156,
      width: 310,
      startFontSize: 18,
      minFontSize: 10,
      fontWeight: 700,
      color: "#333",
    },

    orgLine2: {
      left: 36,
      top: 184,
      width: 240,
      startFontSize: 18,
      minFontSize: 10,
      fontWeight: 700,
      color: "#333",
    },
  };

  if (badgeId === 1) {
    return {
      ...base,
      name: {
        ...base.name,
        left: 32,
        top: 28,
        width: 445,
        startFontSize: 38,
      },
      title: {
        ...base.title,
        left: 36,
        top: 86,
        width: 360,
        startFontSize: 22,
      },
    };
  }

  if (badgeId === 2) {
    return {
      ...base,
      name: {
        ...base.name,
        left: 32,
        top: 28,
        width: 445,
        startFontSize: 38,
      },
      title: {
        ...base.title,
        left: 36,
        top: 84,
        width: 360,
        startFontSize: 20,
      },
      orgLine1: {
        ...base.orgLine1,
        left: 36,
        top: 164,
        width: 330,
        startFontSize: 18,
      },
    };
  }

  if (badgeId === 3) {
    return {
      ...base,
      name: {
        ...base.name,
        left: 32,
        top: 28,
        width: 445,
        startFontSize: 38,
      },
      title: {
        ...base.title,
        left: 36,
        top: 82,
        width: 360,
        startFontSize: 18,
      },
      titleLine2: {
        ...base.titleLine2,
        left: 36,
        top: 106,
        width: 360,
        startFontSize: 18,
      },
    };
  }

  if (badgeId === 4) {
    return {
      ...base,
      name: {
        ...base.name,
        left: 32,
        top: 28,
        width: 445,
        startFontSize: 38,
      },
      title: {
        ...base.title,
        left: 36,
        top: 84,
        width: 360,
        startFontSize: 20,
      },
      orgLine1: {
        ...base.orgLine1,
        left: 36,
        top: 152,
        width: 300,
        startFontSize: 18,
      },
      orgLine2: {
        ...base.orgLine2,
        left: 36,
        top: 180,
        width: 240,
        startFontSize: 18,
      },
    };
  }

  if (badgeId === 208) {
    return {
      ...base,
      name: {
        ...base.name,
        left: 32,
        top: 28,
        width: 445,
        startFontSize: 38,
      },
      title: {
        ...base.title,
        left: 36,
        top: 84,
        width: 360,
        startFontSize: 20,
      },
      orgLine1: {
        ...base.orgLine1,
        left: 36,
        top: 164,
        width: 330,
        startFontSize: 18,
      },
    };
  }

  if (badgeId === 211) {
    return {
      ...base,
      name: {
        ...base.name,
        left: 32,
        top: 28,
        width: 445,
        startFontSize: 38,
      },
      title: {
        ...base.title,
        left: 36,
        top: 86,
        width: 360,
        startFontSize: 22,
      },
    };
  }

  if (badgeId === 212) {
    return {
      ...base,
      name: {
        ...base.name,
        left: 32,
        top: 28,
        width: 445,
        startFontSize: 38,
      },
      title: {
        ...base.title,
        left: 36,
        top: 84,
        width: 360,
        startFontSize: 20,
      },
      orgLine1: {
        ...base.orgLine1,
        left: 36,
        top: 164,
        width: 330,
        startFontSize: 18,
      },
    };
  }

  return base;
}

function getDoorSignLayout() {
  return {
    width: 1738,
    height: 863,
    line1: {
      left: 145,
      top: 118,
      width: 1280,
      height: 220,
      startFontSize: 178,
      minFontSize: 58,
      fontWeight: 400,
      color: "#222222",
      lineHeight: 0.92,
      letterSpacing: "-0.01em",
    },
    line2: {
      left: 145,
      top: 355,
      width: 1280,
      height: 220,
      startFontSize: 178,
      minFontSize: 58,
      fontWeight: 400,
      color: "#222222",
      lineHeight: 0.92,
      letterSpacing: "-0.01em",
    },
  };
}

function getProfessionPreviewValues(productForm = {}) {
  const chosenProfession = getChosenProfession(
    productForm?.professionChoiceId || "lakare"
  );

  return {
    title: productForm?.title || chosenProfession?.label || "Yrkestitel",
    color: productForm?.color || chosenProfession?.color || "röd",
    textColor: productForm?.textColor || chosenProfession?.textColor || "vit",
  };
}

function getHangingSignType(badgeId) {
  if (badgeId === 303 || badgeId === 304) return "small";
  if (badgeId === 305 || badgeId === 306 || badgeId === 307 || badgeId === 308) {
    return "xlarge";
  }
  return "large";
}

function isDoubleSidedHangingSign(badgeId) {
  return badgeId === 302 || badgeId === 304 || badgeId === 306 || badgeId === 308;
}

function getHangingSignTextMode(badge, productForm) {
  return badge?.hangingSignTextMode || productForm?.hangingSignTextMode || "single";
}

function getHangingSignVariantConfig(badgeId, badge, productForm) {
  const type = getHangingSignType(badgeId);
  const textMode = getHangingSignTextMode(badge, productForm);
  const variant = HANGING_SIGN_VARIANTS[type];

  return {
    ...variant,
    type,
    textMode,
    textLayout: variant.textLayouts[textMode] || variant.textLayouts.single,
  };
}

function getHangingSignPreviewValues(productForm = {}) {
  return {
    text: productForm?.customText || "Egen text",
    textLine1: productForm?.customTextLine1 || productForm?.customText || "Rad 1",
    textLine2: productForm?.customTextLine2 || "",
    arrowPlacement: productForm?.arrowPlacement || "none",
    arrowDirection: productForm?.arrowDirection || "",
  };
}

function getDoorSignPreviewValues(productForm = {}) {
  return {
    textLine1: (productForm?.customText || "Textrad 1").toUpperCase(),
    textLine2: (productForm?.customTextLine2 || "").toUpperCase(),
  };
}

function renderNameField({
  condition,
  badgeId,
  fieldKey,
  layoutField,
  text,
  mini,
  lineHeight = 1.05,
}) {
  if (!condition || !layoutField) return null;

  const leftOffset = mini ? getMiniFieldOffset(badgeId, fieldKey) : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: layoutField.left + leftOffset,
        top: layoutField.top,
        width: layoutField.width,
      }}
    >
      <AutoFitText
        text={text}
        maxWidth={layoutField.width}
        startFontSize={layoutField.startFontSize}
        minFontSize={layoutField.minFontSize}
        fontWeight={layoutField.fontWeight}
        color={layoutField.color}
        lineHeight={lineHeight}
      />
    </div>
  );
}

function HangingSignArrow({ arrowLayouts, placement, direction }) {
  if (!placement || placement === "none" || !direction) return null;

  const layout =
    placement === "left"
      ? arrowLayouts.left
      : placement === "right"
      ? arrowLayouts.right
      : null;

  const src = HANGING_SIGN_ARROW_SRC[direction];

  if (!layout || !src) return null;

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      style={{
        position: "absolute",
        left: layout.left,
        right: layout.right,
        top: layout.top,
        width: layout.width,
        height: layout.height,
        objectFit: "contain",
        display: "block",
      }}
    />
  );
}

function HangingSignFace({
  textMode,
  textLayout,
  preview,
  arrowLayouts,
  arrowPlacement,
  arrowDirection,
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      {textMode === "double" ? (
        <>
          <div
            style={{
              position: "absolute",
              left: textLayout.line1.left,
              top: textLayout.line1.top,
              width: textLayout.line1.width,
              height: textLayout.line1.height,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              textAlign: "left",
            }}
          >
            <AutoFitText
              text={preview.textLine1}
              maxWidth={textLayout.line1.width}
              startFontSize={textLayout.line1.startFontSize}
              minFontSize={textLayout.line1.minFontSize}
              fontWeight={500}
              color="#111111"
              lineHeight={1}
              style={{
                width: "100%",
                textAlign: "left",
                letterSpacing: "-0.01em",
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              left: textLayout.line2.left,
              top: textLayout.line2.top,
              width: textLayout.line2.width,
              height: textLayout.line2.height,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              textAlign: "left",
            }}
          >
            <AutoFitText
              text={preview.textLine2}
              maxWidth={textLayout.line2.width}
              startFontSize={textLayout.line2.startFontSize}
              minFontSize={textLayout.line2.minFontSize}
              fontWeight={500}
              color="#111111"
              lineHeight={1}
              style={{
                width: "100%",
                textAlign: "left",
                letterSpacing: "-0.01em",
              }}
            />
          </div>
        </>
      ) : (
        <div
          style={{
            position: "absolute",
            left: textLayout.line1.left,
            top: textLayout.line1.top,
            width: textLayout.line1.width,
            height: textLayout.line1.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            textAlign: "left",
          }}
        >
          <AutoFitText
            text={preview.text}
            maxWidth={textLayout.line1.width}
            startFontSize={textLayout.line1.startFontSize}
            minFontSize={textLayout.line1.minFontSize}
            fontWeight={500}
            color="#111111"
            lineHeight={1}
            style={{
              width: "100%",
              textAlign: "left",
              letterSpacing: "-0.01em",
            }}
          />
        </div>
      )}

      <HangingSignArrow
        arrowLayouts={arrowLayouts}
        placement={arrowPlacement}
        direction={arrowDirection}
      />
    </div>
  );
}

function renderSingleHangingSign({
  config,
  width,
  height,
  scale,
  preview,
  arrowPlacement,
  arrowDirection,
}) {
  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        flex: "0 0 auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: config.base.width,
          height: config.base.height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <img
          src={config.template}
          alt="Pendlad skylt"
          style={{
            width: config.base.width,
            height: config.base.height,
            objectFit: "contain",
            display: "block",
          }}
        />

        <HangingSignFace
          textMode={config.textMode}
          textLayout={config.textLayout}
          preview={preview}
          arrowLayouts={config.arrowLayouts}
          arrowPlacement={arrowPlacement}
          arrowDirection={arrowDirection}
        />
      </div>
    </div>
  );
}

function renderHangingSignPreview(badgeId, productForm, maxWidth, mini) {
  const badge = getBadgeById(badgeId);
  const config = getHangingSignVariantConfig(badgeId, badge, productForm);
  const preview = getHangingSignPreviewValues(productForm);

  const previewWidth = mini ? config.previewWidth.mini : config.previewWidth.form;
  const targetWidth = Math.min(maxWidth || previewWidth, previewWidth);
  const scale = targetWidth / config.base.width;
  const targetHeight = config.base.height * scale;

  const secondSignMarginTop = mini
    ? config.secondSignMarginTop.mini
    : config.secondSignMarginTop.form;

  const isDoubleSided = isDoubleSidedHangingSign(badgeId);

  return (
    <div style={wrapperStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {renderSingleHangingSign({
          config,
          width: targetWidth,
          height: targetHeight,
          scale,
          preview,
          arrowPlacement: preview.arrowPlacement,
          arrowDirection: preview.arrowDirection,
        })}

        {isDoubleSided && (
          <div style={{ marginTop: secondSignMarginTop }}>
            {renderSingleHangingSign({
              config,
              width: targetWidth,
              height: targetHeight,
              scale,
              preview,
              arrowPlacement: getMirroredPlacement(preview.arrowPlacement),
              arrowDirection: getMirroredDirection(preview.arrowDirection),
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function renderProfessionPreview(productForm, maxWidth, mini) {
  const preview = getProfessionPreviewValues(productForm);
  const { background, color } = getProfessionCardColors(
    preview.color,
    preview.textColor
  );

  const targetWidth = mini ? Math.min(maxWidth || 190, 190) : maxWidth || 700;
  const targetHeight = mini ? 70 : 180;
  const isWhiteBadge = (preview.color || "").toLowerCase() === "vit";

  return (
    <div style={wrapperStyle}>
      <div
        style={{
          ...professionBadgeStyle,
          width: targetWidth,
          height: targetHeight,
          background,
          color,
          borderRadius: mini ? 12 : 14,
          padding: mini ? "0 10px" : "0 24px",
          maxWidth: "100%",
          ...(isWhiteBadge ? whiteProfessionBadgeStyle : {}),
        }}
      >
        <AutoFitText
          text={preview.title}
          maxWidth={mini ? targetWidth - 20 : targetWidth - 48}
          startFontSize={mini ? 26 : 82}
          minFontSize={mini ? 11 : 28}
          fontWeight={400}
          color={color}
          lineHeight={1}
          style={{
            width: "100%",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        />
      </div>
    </div>
  );
}

function renderNameBadgePreview(badgeId, productForm, maxWidth, mini) {
  const badge = getBadgeById(badgeId);
  if (!badge) return null;

  const fields = badge.fields || {};
  const layout = getNameBadgeLayout(badgeId);
  const templateSrc = getNameBadgeTemplateSrc(badgeId);

  const targetWidth = Math.min(maxWidth || layout.width, layout.width);
  const scale = targetWidth / layout.width;
  const targetHeight = layout.height * scale;

  return (
    <div style={wrapperStyle}>
      <div
        style={{
          width: targetWidth,
          height: targetHeight,
          position: "relative",
          flex: "0 0 auto",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: layout.width,
            height: layout.height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <img
            src={templateSrc}
            alt="Namnskylt"
            style={{
              width: layout.width,
              height: layout.height,
              objectFit: "contain",
              display: "block",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
            }}
          >
            {renderNameField({
              condition: fields.name,
              badgeId,
              fieldKey: "name",
              layoutField: layout.name,
              text: productForm?.name || "Namn Efternamn",
              mini,
            })}

            {renderNameField({
              condition: fields.title,
              badgeId,
              fieldKey: "title",
              layoutField: layout.title,
              text: productForm?.title || "Titel",
              mini,
              lineHeight: 1.08,
            })}

            {renderNameField({
              condition: fields.titleLine2,
              badgeId,
              fieldKey: "titleLine2",
              layoutField: layout.titleLine2,
              text: productForm?.titleLine2 || "Titel",
              mini,
              lineHeight: 1.08,
            })}

            {renderNameField({
              condition: fields.orgLine1,
              badgeId,
              fieldKey: "orgLine1",
              layoutField: layout.orgLine1,
              text: productForm?.orgLine1 || "Verksamhetsnamn 1 rad",
              mini,
            })}

            {renderNameField({
              condition: fields.orgLine2,
              badgeId,
              fieldKey: "orgLine2",
              layoutField: layout.orgLine2,
              text: productForm?.orgLine2 || "2 rader",
              mini,
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderDoorSignPreview(badgeId, productForm, maxWidth, mini) {
  const layout = getDoorSignLayout();
  const templateSrc = getDoorSignTemplateSrc(badgeId);
  const preview = getDoorSignPreviewValues(productForm);

  const previewWidth = mini
    ? Math.min(maxWidth || 240, 240)
    : Math.min(maxWidth || 760, 760);

  const scale = previewWidth / layout.width;
  const targetHeight = layout.height * scale;

  const line1StartFontSize = mini ? 198 : layout.line1.startFontSize;
  const line1MinFontSize = mini ? 62 : layout.line1.minFontSize;
  const line2StartFontSize = mini ? 198 : layout.line2.startFontSize;
  const line2MinFontSize = mini ? 62 : layout.line2.minFontSize;

  return (
    <div style={wrapperStyle}>
      <div
        style={{
          width: previewWidth,
          height: targetHeight,
          position: "relative",
          flex: "0 0 auto",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: layout.width,
            height: layout.height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <img
            src={templateSrc}
            alt="Dörrskylt"
            style={{
              width: layout.width,
              height: layout.height,
              objectFit: "contain",
              display: "block",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: layout.line1.left,
                top: layout.line1.top,
                width: layout.line1.width,
                height: layout.line1.height,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                textAlign: "left",
              }}
            >
              <AutoFitText
                text={preview.textLine1}
                maxWidth={layout.line1.width}
                startFontSize={line1StartFontSize}
                minFontSize={line1MinFontSize}
                fontWeight={layout.line1.fontWeight}
                color={layout.line1.color}
                lineHeight={layout.line1.lineHeight}
                style={{
                  width: "100%",
                  textAlign: "left",
                  letterSpacing: layout.line1.letterSpacing,
                  textTransform: "uppercase",
                }}
              />
            </div>

            {preview.textLine2 ? (
              <div
                style={{
                  position: "absolute",
                  left: layout.line2.left,
                  top: layout.line2.top,
                  width: layout.line2.width,
                  height: layout.line2.height,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  textAlign: "left",
                }}
              >
                <AutoFitText
                  text={preview.textLine2}
                  maxWidth={layout.line2.width}
                  startFontSize={line2StartFontSize}
                  minFontSize={line2MinFontSize}
                  fontWeight={layout.line2.fontWeight}
                  color={layout.line2.color}
                  lineHeight={layout.line2.lineHeight}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    letterSpacing: layout.line2.letterSpacing,
                    textTransform: "uppercase",
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BadgePreview({
  badgeId,
  productType,
  productForm,
  maxWidth = 600,
  mini = false,
}) {
  const isProfession =
    isProfessionProductType(productType) ||
    productForm?.previewType === "profession" ||
    productForm?.productType === "yrkestitelsskylt" ||
    productForm?.categoryId === "yrkestitelsskyltar";

  const isHangingSign =
    productType === "pendlad_skylt" ||
    productForm?.productType === "pendlad_skylt" ||
    productForm?.previewType === "hanging_sign" ||
    productForm?.categoryId === "pendlade-vit";

  const isDoorSign =
    productType === "dorrskylt" ||
    productForm?.productType === "dorrskylt" ||
    productForm?.previewType === "door_sign" ||
    productForm?.categoryId === "dorrskyltar";

  if (isProfession) {
    return renderProfessionPreview(productForm, maxWidth, mini);
  }

  if (isHangingSign) {
    return renderHangingSignPreview(badgeId, productForm, maxWidth, mini);
  }

  if (isDoorSign) {
    return renderDoorSignPreview(badgeId, productForm, maxWidth, mini);
  }

  return renderNameBadgePreview(badgeId, productForm, maxWidth, mini);
}

const wrapperStyle = {
  display: "flex",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 0,
  marginBottom: 0,
};

const professionBadgeStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  fontWeight: 400,
  textAlign: "center",
  overflow: "hidden",
};

const whiteProfessionBadgeStyle = {
  border: "1px solid rgba(0,0,0,0.12)",
};