/* eslint-disable react/prop-types */
import React from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import PropTypes from "prop-types"; // import Table from "react-bootstrap/Table";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import CustomInput from "components/CustomInput/CustomInput";
import { useEffect } from "react";

const styles = {
  errorMessage: {
    color: "red",
  },
};

const useStyles = makeStyles(styles);

export default function BOMTable({ formula, formulaBOMJSON, project }) {
  const [product_name, setProdcut_name] = useState(project.product_name);
  const [brand, setBrand] = useState(project.brand_name);
  const [tolerance, setTolerance] = useState(formula.loss);
  const [proceduceStep1, setProStep] = useState();
  // eslint-disable-next-line no-unused-vars
  const [materialNormLoss, setMaterialNormLoss] = useState(
    project.material_norm_loss
  );
  const [bareCode, setBareCode] = useState("");
  const [orderCode, setOrderCode] = useState("");

  const [formError, setFormErrors] = useState({});
  const [listTest, setListTest] = useState([]);
  const classes = useStyles();
  console.log(project);
  console.log(formula);
  console.log(formulaBOMJSON);
  const convertJsonTestToOject = () => {
    const list = [];
    for (const i in formulaBOMJSON.qualityTracking) {
      const test = {
        content: i,
        expect: formulaBOMJSON.qualityTracking[i],
      };
      list.push(test);
    }
    setListTest(list);
  };

  useEffect(() => {
    setProStep(proceduce());
    convertJsonTestToOject();
  }, []);

  const proceduceStep = () => {
    const list = [];
    formula.phaseGetResponse.forEach((phase) => {
      const step = phase.phase_description.split("\n");
      step.forEach((s) => {
        list.push(s);
      });
    });
    return list;
  };
  const proceduce = () => {
    const listStep = proceduceStep();
    var value = "";
    listStep.forEach((step, index) => {
      const i = index + 1;
      value += i + "." + listStep[index] + "\n";
    });
    return value;
  };
  // eslint-disable-next-line no-unused-vars
  const proceduceRow = <tr>{proceduce}</tr>;
  // eslint-disable-next-line no-unused-vars
  const materialRow = (material, index) => {
    return (
      <tr>
        <td>{index + 1}</td>
        <td>{material.mixed}</td>
        <td>{material.code}</td>
        <td>{material.tradeName}</td>
        <td>{material.rate}</td>
      </tr>
    );
  };
  const materialColum = formulaBOMJSON.materialData.map((mater, index) =>
    materialRow(mater, index)
  );
  const materialRow2 = (material, index) => {
    return (
      <tr>
        <td>{index + 1}</td>
        <td>{material.mixed}</td>
        <td>{material.code}</td>
        <td>{material.name}</td>
        <td>{material.inciName}</td>
        <td>{material.supplierName}</td>
        <td>{material.function}</td>
        <td>{material.rate}</td>
        <td>{parseFloat(material.cost_kg).toLocaleString(`en-US`)}</td>
        <td>
          {parseFloat(
            (material.cost_formula *
              material.rate *
              formula.formula_weight *
              (1 + tolerance / 100)) /
              100
          ).toLocaleString(`en-US`)}
        </td>
      </tr>
    );
  };
  const materialColum2 = formulaBOMJSON.materialData.map((mater, index) =>
    materialRow2(mater, index)
  );
  const qualityRow = (content, expect) => {
    return (
      <tr>
        <td>{content}</td>
        <td></td>
        <td>{expect}</td>
        <td></td>
        <td></td>
      </tr>
    );
  };
  const qualityRow2 = (content, expect) => {
    return (
      <tr>
        <td colSpan={5}>
          <b>{content}:</b>
          {expect}
        </td>
      </tr>
    );
  };

  const qualityColumn2 = listTest.map((test) =>
    qualityRow2(test.content, test.expect)
  );

  const qualityColumn = listTest.map((test) =>
    qualityRow(test.content, test.expect)
  );
  const qualityTracking = (
    <>
      <tr>
        <td colSpan="5">
          <b>THEO D??I CH???T L?????NG</b>
        </td>
      </tr>
      <tr>
        <td>
          <b>Ch??? ti??u</b>
        </td>
        <td></td>
        <td>
          <b>Ti??u chu???n</b>
        </td>
        <td></td>
        <td></td>
      </tr>
      {qualityColumn}
    </>
  );
  const qualityTracking2 = (
    <>
      <tr>
        <td colSpan="4">
          <b>
            <u>Ki???u tra ch???t l?????ng b??n th??nh ph???m</u>
          </b>
        </td>
      </tr>
      <tr></tr>
      {qualityColumn2}
    </>
  );
  const handleProductNameInput = (e) => {
    setProdcut_name(e.target.value);
    if (e.target.value === "") {
      setFormErrors({
        ...formError,
        product_name: "T??n s???n ph???m kh??ng ???????c ????? tr???ng",
      });
    } else if (e.target.value.length > 255) {
      setFormErrors({
        ...formError,
        product_name: "T??n s???n ph???m kh??ng ???????c qu?? 255 k?? t???",
      });
    } else {
      setFormErrors({
        ...formError,
        product_name: "",
      });
    }
  };
  const handleBarecode = (e) => {
    setBareCode(e.target.value);
    if (!/^[0-9]+$/.test(e.target.value)) {
      setFormErrors({
        ...formError,
        barecode: "M?? v???ch ch??? ch???a k?? t??? 0-9",
      });
    } else if (e.target.value.length === 0) {
      setFormErrors({
        ...formError,
        barecode: "M?? v???ch kh??ng ???????c ????? tr???ng",
      });
    } else {
      setFormErrors({
        ...formError,
        barecode: "",
      });
    }
  };
  const handleBrand = (e) => {
    setBrand(e.target.value);
    if (e.target.value === "") {
      setFormErrors({
        ...formError,
        brand_name: "Th????ng hi???u kh??ng ???????c ????? tr???ng",
      });
    } else if (e.target.value.length > 255) {
      setFormErrors({
        ...formError,
        brand_name: "Th????ng hi???u kh??ng ???????c qu?? 255 k?? t???",
      });
    } else {
      setFormErrors({
        ...formError,
        brand_name: "",
      });
    }
  };
  const handleOrderCode = (e) => {
    setOrderCode(e.target.value);
    if (!/^[0-9]+$/.test(e.target.value)) {
      setFormErrors({
        ...formError,
        orderCode: "M?? ????n h??ng ch??? ch???a k?? t??? 0-9",
      });
    } else if (e.target.value.length === 0) {
      setFormErrors({
        ...formError,
        orderCode: "M?? ????n h??ng kh??ng ???????c ????? tr???ng",
      });
    } else {
      setFormErrors({
        ...formError,
        orderCode: "",
      });
    }
  };
  const handleTolerance = (e) => {
    setTolerance(e.target.value);
    if (!e.target.value.match(/^[+]?((\.\d+)|(\d+(\.\d+)?)|(\d+\.))$/)) {
      setFormErrors({
        ...formError,
        tolerance: "Hao h???t ph???i l?? s??? t??? nhi??n l???n h??n ho???c b???ng 0",
      });
    } else {
      setFormErrors({
        ...formError,
        tolerance: "",
      });
    }
  };
  const handled = (e) => {
    formula.density = e.target.value;
    if (!e.target.value.match(/^[+]?((\.\d+)|(\d+(\.\d+)?)|(\d+\.))$/)) {
      setFormErrors({
        ...formError,
        norm_loss: "d ph???i s??? l???n h??n ho???c b???ng 0",
      });
    } else {
      setFormErrors({
        ...formError,
        norm_loss: "",
      });
    }
  };

  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4} onChange={handleProductNameInput}>
          <CustomInput
            color="primary"
            labelText="T??n s???n ph???m"
            id="product_name"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              multiline: false,
              rows: 1,
              value: product_name,
            }}
          />
          <p className={classes.errorMessage}>{formError.product_name}</p>
        </GridItem>
        <GridItem xs={12} sm={12} md={4} onChange={handleBarecode}>
          <CustomInput
            color="primary"
            labelText="M?? v???ch"
            id="bare_code"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              multiline: false,
              rows: 1,
            }}
          />
          <p className={classes.errorMessage}>{formError.barecode}</p>
        </GridItem>
        <GridItem xs={12} sm={12} md={4} onChange={handleBrand}>
          <CustomInput
            color="primary"
            labelText="Th????ng hi???u"
            id="brand"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              multiline: false,
              rows: 1,
              value: brand,
            }}
          />
          <p className={classes.errorMessage}>{formError.brand_name}</p>
        </GridItem>
        <GridItem xs={12} sm={12} md={4} onChange={handleOrderCode}>
          <CustomInput
            color="primary"
            labelText="M?? ????n h??ng"
            id="order_code"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              multiline: false,
              rows: 1,
            }}
          />
          <p className={classes.errorMessage}>{formError.orderCode}</p>
        </GridItem>
        <GridItem xs={12} sm={12} md={4} onChange={handled}>
          <CustomInput
            color="primary"
            labelText="d"
            id="unknow"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              multiline: false,
              rows: 1,
              value: formula.density,
            }}
          />
          <p className={classes.errorMessage}>{formError.norm_loss}</p>
        </GridItem>
        <GridItem xs={12} sm={12} md={4} onChange={handleTolerance}>
          <CustomInput
            color="primary"
            labelText="Hao h???t"
            id="tolerant"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              multiline: false,
              rows: 1,
              value: tolerance,
            }}
          />
          <p className={classes.errorMessage}>{formError.tolerance}</p>
        </GridItem>
      </GridContainer>
      <div>
        <GridItem xs={12} sm={12} md={12}>
          <div>
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button"
              table="table-to-xls"
              filename={`BOM-${product_name}`}
              sheet="tablexls"
              buttonText="Download as XLS"
            />
          </div>
          <div>
            <table id="table-to-xls">
              <tbody>
                <tr>
                  <td colSpan="5">
                    <b>PHI???U THEO D??I S???N XU???T</b>
                  </td>
                </tr>
                <tr>
                  <td>S???n ph???m</td>
                  <td></td>
                  <td>{product_name}</td>
                  <td>M?? V???ch </td>
                  <td>{bareCode}</td>
                </tr>
                <tr>
                  <td>Th????ng hi???u</td>
                  <td></td>
                  <td>{brand}</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>M?? ????n h??ng</td>
                  <td></td>
                  <td>{orderCode}</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="2">Kh???i l?????ng ????n v??? (g)</td>
                  <td>{formula.formula_weight}</td>
                  <td>Dung t??ch ????n v??? (ml)</td>
                  <td>{formula.volume} </td>
                </tr>
                <tr>
                  <td>
                    <b>Formula Version</b>
                  </td>
                  <td></td>
                  <td></td>
                  <td>{formula.formula_version}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>d (g/ml)</td>
                  <td></td>
                  <td></td>
                  <td>{formula.density}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>dung sai</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>hao h???t</td>
                  <td></td>
                  <td>{tolerance}%</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td rowSpan="2">
                    <b>STT</b>
                  </td>
                  <td rowSpan="2">
                    <b>Pha</b>
                  </td>
                  <td colSpan="2">
                    <b>Nguy??n li???u</b>
                  </td>
                  <td rowSpan="2">
                    <b>T??? l??? (%w/w)</b>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Code</b>
                  </td>
                  <td>
                    <b>T??n th????ng m???i</b>
                  </td>
                </tr>
                {materialColum}
                <tr>
                  <td>T???ng</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>100</td>
                </tr>
                <tr> </tr>
                <tr></tr>
                {qualityTracking}
              </tbody>
            </table>
          </div>
        </GridItem>
      </div>

      <div>
        <GridItem xs={12} sm={12} md={12}>
          <div>
            <ReactHTMLTableToExcel
              id="test-table-xls-button2"
              className="download-table-xls-button"
              table="table2-to-xls"
              filename={`BOM-${product_name}`}
              sheet="tablexls"
              buttonText="Download as XLS"
            />
          </div>
          <div>
            <table id="table2-to-xls">
              <tbody>
                <tr>
                  <td colSpan="9">
                    <b>{product_name}</b>
                  </td>
                </tr>
                <tr></tr>
                <tr></tr>
                <tr>
                  <td></td>
                  <td>S???n ph???m</td>
                  <td></td>
                  <td>{product_name}</td>
                  <td></td>
                  <td>M?? V???ch </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{bareCode}</td>
                </tr>
                <tr>
                  <td></td>
                  <td>Th????ng hi???u</td>
                  <td></td>
                  <td>{brand}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>M?? ????n h??ng</td>
                  <td></td>
                  <td>{orderCode}</td>
                  <td></td>
                  <td>Khlg</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td colSpan="2">Kh???i l?????ng ????n v??? (g)</td>
                  <td>{formula.formula_weight}</td>
                  <td>Dung t??ch ????n v??? (ml): {formula.volume}</td>
                  <td>Klg m???</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td colSpan="2">
                    <b>Formula Version</b>
                  </td>
                  <td>{formula.formula_version}</td>
                  {formula.modified_time ? (
                    <td>
                      {new Date(formula.modified_time).toLocaleDateString(
                        "en-US"
                      )}
                    </td>
                  ) : (
                    <td>
                      {new Date(formula.created_time).toLocaleDateString(
                        "en-US"
                      )}
                    </td>
                  )}
                  <td>
                    <b>S??? m???</b>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>d (g/ml)</td>
                  <td></td>
                  <td></td>
                  <td>{formula.density}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>dung sai</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>hao h???t</td>
                  <td></td>
                  <td>{tolerance}%</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr></tr>
                <tr>
                  <td>
                    <b>No.</b>
                  </td>
                  <td></td>
                  <td>
                    <b>Code</b>
                  </td>
                  <td>
                    <b>Ingredient</b>
                  </td>
                  <td>
                    <b>INCI</b>
                  </td>
                  <td>
                    <b>Supplier</b>
                  </td>
                  <td>
                    <b>Function</b>
                  </td>
                  <td>
                    <b>%(w/w)</b>
                  </td>
                  <td>
                    <b>Ing Cost (per kg)</b>
                  </td>
                  <td>
                    <b>Cost in use ({formula.formula_weight}gr)</b>
                  </td>
                </tr>
                {materialColum2}
                <tr>
                  <td colSpan={7}>
                    <b>Total</b>
                  </td>
                  <td>100</td>
                </tr>
                <tr></tr>
                <tr>
                  <td colSpan={2}>
                    <b>Procedure</b>
                  </td>
                </tr>
                <tr>
                  <td>{proceduceStep1}</td>
                </tr>
                <tr></tr>
                {qualityTracking2}
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>Note:</td>
                  <td colSpan={3}></td>
                </tr>
                <tr></tr>
                <tr></tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <b>R&D STAFF</b>
                  </td>
                  <td></td>
                  <td></td>
                  <td>
                    <b>Duy???t</b>
                  </td>
                </tr>
                <tr></tr>
                <tr></tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>Ng??y {new Date().toLocaleDateString("en-US")}</td>
                  <td></td>
                  <td></td>
                  <td>Ng??y ___/___/20..</td>
                </tr>
              </tbody>
            </table>
          </div>
        </GridItem>
      </div>
    </>
  );
}
BOMTable.propTypes = {
  formulaBOMJSON: PropTypes.object.isRequired,
};
BOMTable.propTypes = {
  project: PropTypes.object.isRequired,
};
BOMTable.propTypes = {
  formula: PropTypes.object.isRequired,
};
