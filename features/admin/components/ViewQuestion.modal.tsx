import { Questions } from "@/shared/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const ViewQuestion = ({
  show,
  question,
  handleCloseModal,
}: {
  show: boolean;
  question: Questions;
  handleCloseModal: VoidFunction;
}) => {
  const { optionA, optionB, optionC, optionD, correct } = question;

  const correctValue = question[`option${correct}` as keyof Questions];

  return (
    <Box>
      <BootstrapDialog
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={show}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Question Category ({question.category})
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseModal}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>
            Q: {question.question}
          </Typography>
          {[optionA, optionB, optionC, optionD].map((val, i) => (
            <Typography gutterBottom key={val}>
              Option {i + 1}: {val} {correctValue === val ? "(✓)" : ""}
            </Typography>
          ))}
          <Typography gutterBottom></Typography>
        </DialogContent>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>
            Difficultly Level: {question.difficulty}
          </Typography>
        </DialogContent>
      </BootstrapDialog>
    </Box>
  );
};

export default ViewQuestion;
