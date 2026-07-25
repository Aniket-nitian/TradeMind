import ExcelJS from "exceljs";
import { AppError } from "../../../shared/exceptions/AppError.js";

export async function parseXlsxSheet(
    buffer: Buffer,
    sheetName: string
): Promise<string[][]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);

    const sheet = workbook.worksheets.find(
        (ws) => ws.name.trim().toLowerCase() === sheetName.trim().toLowerCase()
    );

    if (!sheet) {
        throw new AppError(
            `Expected a "${sheetName}" sheet in the uploaded Excel file, but found: ${workbook.worksheets
                .map((ws) => ws.name)
                .join(", ")}.`,
            400
        );
    }

    const rows: string[][] = [];

    sheet.eachRow((row) => {
        const values: string[] = [];

        const cells = (row.values as unknown[]).slice(1);

        for (const cell of cells) {
            if (cell === null || cell === undefined) {
                values.push("");
                continue;
            }

            if (cell instanceof Date) {
                values.push(cell.toISOString());
                continue;
            }

            if (typeof cell === "object" && "text" in (cell as Record<string, unknown>)) {
                values.push(String((cell as { text: unknown }).text));
                continue;
            }

            values.push(String(cell));
        }

        rows.push(values);
    });

    return rows;
}

export function isXlsxBuffer(buffer: Buffer): boolean {
    return (
        buffer.length >= 4 &&
        buffer[0] === 0x50 &&
        buffer[1] === 0x4b &&
        buffer[2] === 0x03 &&
        buffer[3] === 0x04
    );
}
