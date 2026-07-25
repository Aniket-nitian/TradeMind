import { parse } from "csv-parse";
import { AppError } from "../../../shared/exceptions/AppError.js";
import { isXlsxBuffer } from "./xlsxParser.js";

export const parseCsv = (
    buffer: Buffer
): Promise<any[]> => {
    if (isXlsxBuffer(buffer)) {
        throw new AppError(
            "This broker's import only supports .csv files — the uploaded file looks like an .xlsx spreadsheet.",
            400
        );
    }

    return new Promise((resolve, reject) => {
        parse(
            buffer,
            {
                columns: true,
                skip_empty_lines: true,
                trim: true,
            },
            (err, records) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(records);
            }
        );
    });
};
