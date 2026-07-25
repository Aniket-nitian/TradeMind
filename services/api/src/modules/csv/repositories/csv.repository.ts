import { prisma } from "../../../shared/database/prisma.js";
import { Broker, CsvImportStatus } from "../../../generated/prisma/enums.js";
import type { Prisma } from "../../../generated/prisma/client.js";


export class CsvRepository {
    async createImportBatch(
        userId: string,
        data: {
            fileName: string;
            broker?: Broker;
            totalRows: number;
            validRows: number;
            invalidRows: number;
            duplicateRows: number;
            rows: unknown[];
            errors: unknown[];
        }
    ) {
        return prisma.csvImport.create({
            data: {
                userId,
                fileName: data.fileName,
                broker: data.broker,
                totalRows: data.totalRows,
                validRows: data.validRows,
                invalidRows: data.invalidRows,
                duplicateRows: data.duplicateRows,
                rows: data.rows as Prisma.InputJsonValue,
                errors: data.errors as Prisma.InputJsonValue,
            },
        });
    }

    async findImportById(id: string, userId: string) {
        return prisma.csvImport.findFirst({
            where: {
                id,
                userId,
            },
        });
    }

    async findImportHistory(
        userId: string,
        page = 1,
        limit = 20
    ) {
        const skip = (page - 1) * limit;

        const [imports, total] = await prisma.$transaction([
            prisma.csvImport.findMany({
                where: {
                    userId,
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    fileName: true,
                    broker: true,
                    status: true,
                    totalRows: true,
                    validRows: true,
                    invalidRows: true,
                    duplicateRows: true,
                    importedRows: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),

            prisma.csvImport.count({
                where: {
                    userId,
                },
            }),
        ]);

        return {
            imports,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrevious: page > 1,
            },
        };
    }

    async markImportStatus(
        id: string,
        data: {
            status: CsvImportStatus;
            importedRows: number;
        }
    ) {
        return prisma.csvImport.update({
            where: {
                id,
            },
            data,
        });
    }

}