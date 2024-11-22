import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Spacer } from "@nextui-org/react";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card
        css={{
          maxWidth: "400px",
          padding: "20px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
        }}
      >
        <h2
          style={{
            color: "#e63946",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
          Akses Ditolak
        </h2>
        <Spacer y={0.5} />
        <p style={{ textAlign: "center", fontSize: "1rem", color: "#555555" }}>
          Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi
          admin jika Anda memerlukan akses tambahan.
        </p>
        <Spacer y={1} />
        <Button
          onClick={() => navigate("/")}
          css={{
            width: "100%",
            backgroundColor: "#38a169",
            color: "#fff",
            fontWeight: "bold",
          }}
          auto
        >
          Kembali ke Dashboard
        </Button>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;
