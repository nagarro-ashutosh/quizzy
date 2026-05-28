import { Box, Stack, Typography } from "@mui/material";
import React, { ReactNode } from "react";
interface IPageHeaderProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}
const PageHeader: React.FC<IPageHeaderProps> = ({
  title,
  description,
  action,
}) => {
  return (
    <Box component={"header"}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{
          alignItems: { xs: "stretch", md: "flex-start" },
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant={"h1"}>{title}</Typography>
          {description ? (
            <Typography sx={{ color: "text.secondary", maxWidth: 720, mt: 1 }}>
              {description}
            </Typography>
          ) : (
            <></>
          )}
        </Box>
        {action}
      </Stack>
    </Box>
  );
};

export default PageHeader;
