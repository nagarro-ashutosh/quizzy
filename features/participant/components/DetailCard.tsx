import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

const DetailCard: React.FC<{
  title: string;
  value: string | undefined;
  tone?: string;
}> = ({ title, value, tone }) => {
  return (
    <>
      <Card component="article">
        <CardContent>
          <Typography sx={{ color: "text.secondary", fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography
            variant="h2"
            sx={{
              color:
                tone === "success"
                  ? "success.main"
                  : tone === "error"
                    ? "error.main"
                    : "text.primary",
              mt: 1,
            }}
          >
            {value}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default DetailCard;
