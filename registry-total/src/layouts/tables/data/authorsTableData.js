/* eslint-disable react/prop-types */
// Soft UI Dashboard React components
import SuiBox from "components/SuiBox";
import SuiTypography from "components/SuiTypography";

function Author({ name }) {
  return (
    <SuiBox display="flex" alignItems="center" px={1} py={0.5}>
      <SuiBox display="flex" flexDirection="column">
        <SuiTypography variant="button" fontWeight="medium">
          {name}
        </SuiTypography>
      </SuiBox>
    </SuiBox>
  );
}

export default {
  columns: [
    { name: "owner", align: "left" },
    { name: "type", align: "left" },
    { name: "date", align: "center" },
    { name: "center", align: "center" },
  ],

  rows: [
    {
      owner: <Author name="John Michael" />,
      type: (
        <SuiTypography variant="caption" fontWeight="medium" textColor="text">
          VinFast
        </SuiTypography>
      ),
      date: (
        <SuiTypography variant="caption" fontWeight="medium" textColor="text">
          20/10/2022
        </SuiTypography>
      ),
      center: (
        <SuiTypography variant="caption" fontWeight="medium" textColor="text">
          ABC
        </SuiTypography>
      ),
    },
  ],
};
