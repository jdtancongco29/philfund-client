import type { ApiResponse, GetAllTransactionsResponse, Transaction } from "./BonusLoanPaymentTypes"

// Sample data for development
const sampleTransactions: Transaction[] = [
    {
        id: "1",
        borrower_name: "Doe, Jane",
        transaction_date: "2025/24/04",
        loan_type: "Cash Advance",
        pn_number: "PN-001-134",
        mode_of_payment: "Cash",
        amount_transacted: 20000.0,
        reference: "CA 43344-34536",
        surcharge_amount: 0.0,
        caod: 10000.0,
        slod: 500.0,
        cai: 25750.0,
        sli: 0.0,
        capod: 0.0,
        lpod: 0.0,
        cap: 0.0,
        lp: 0.0,
        atm_number: "1234567890123",
        payment_amount: 0.0,
        remarks: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
        transaction_number: "TRS-32133-423",
        borrower_payment_count: 32,
        district: "PhilFund CDO",
    },
    {
        id: "2",
        borrower_name: "Doe, Jane",
        transaction_date: "2025/24/04",
        loan_type: "Salary Loan",
        pn_number: "PN-001-134",
        mode_of_payment: "Cash",
        amount_transacted: 20000.0,
        reference: "CA 43344-34536",
        surcharge_amount: 0.0,
        caod: 10000.0,
        slod: 500.0,
        cai: 25750.0,
        sli: 0.0,
        capod: 0.0,
        lpod: 0.0,
        cap: 0.0,
        lp: 0.0,
        atm_number: "1234567890123",
        payment_amount: 0.0,
        remarks: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
        transaction_number: "TRS-32133-423",
        borrower_payment_count: 32,
    },
    {
        id: "3",
        borrower_name: "Doe, Jane",
        transaction_date: "2025/24/04",
        loan_type: "Salary Loan",
        pn_number: "PN-001-134",
        mode_of_payment: "Cash",
        amount_transacted: 20000.0,
        reference: "CA 43344-34536",
        surcharge_amount: 0.0,
        caod: 10000.0,
        slod: 500.0,
        cai: 25750.0,
        sli: 0.0,
        capod: 0.0,
        lpod: 0.0,
        cap: 0.0,
        lp: 0.0,
        atm_number: "1234567890123",
        payment_amount: 0.0,
        remarks: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
        transaction_number: "TRS-32133-423",
        borrower_payment_count: 32,
    },
    {
        id: "4",
        borrower_name: "Doe, Jane",
        transaction_date: "2025/24/04",
        loan_type: "Salary Loan",
        pn_number: "PN-001-134",
        mode_of_payment: "Cash",
        amount_transacted: 20000.0,
        reference: "CA 43344-34536",
        surcharge_amount: 0.0,
        caod: 10000.0,
        slod: 500.0,
        cai: 25750.0,
        sli: 0.0,
        capod: 0.0,
        lpod: 0.0,
        cap: 0.0,
        lp: 0.0,
        atm_number: "1234567890123",
        payment_amount: 0.0,
        remarks: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
        transaction_number: "TRS-32133-423",
        borrower_payment_count: 32,
    },
    {
        id: "5",
        borrower_name: "Doe, Jane",
        transaction_date: "2025/24/04",
        loan_type: "Salary Loan",
        pn_number: "PN-001-134",
        mode_of_payment: "Cash",
        amount_transacted: 20000.0,
        reference: "CA 43344-34536",
        surcharge_amount: 0.0,
        caod: 10000.0,
        slod: 500.0,
        cai: 25750.0,
        sli: 0.0,
        capod: 0.0,
        lpod: 0.0,
        cap: 0.0,
        lp: 0.0,
        atm_number: "1234567890123",
        payment_amount: 0.0,
        remarks: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
        transaction_number: "TRS-32133-423",
        borrower_payment_count: 32,
    },
    {
        id: "6",
        borrower_name: "Doe, Jane",
        transaction_date: "2025/24/04",
        loan_type: "Salary Loan",
        pn_number: "PN-001-134",
        mode_of_payment: "Cash",
        amount_transacted: 20000.0,
        reference: "CA 43344-34536",
        surcharge_amount: 0.0,
        caod: 10000.0,
        slod: 500.0,
        cai: 25750.0,
        sli: 0.0,
        capod: 0.0,
        lpod: 0.0,
        cap: 0.0,
        lp: 0.0,
        atm_number: "1234567890123",
        payment_amount: 0.0,
        remarks: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
        transaction_number: "TRS-32133-423",
        borrower_payment_count: 32,
    },
    {
        id: "7",
        borrower_name: "Doe, Jane",
        transaction_date: "2025/24/04",
        loan_type: "Salary Loan",
        pn_number: "PN-001-134",
        mode_of_payment: "Cash",
        amount_transacted: 20000.0,
        reference: "CA 43344-34536",
        surcharge_amount: 0.0,
        caod: 10000.0,
        slod: 500.0,
        cai: 25750.0,
        sli: 0.0,
        capod: 0.0,
        lpod: 0.0,
        cap: 0.0,
        lp: 0.0,
        atm_number: "1234567890123",
        payment_amount: 0.0,
        remarks: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
        transaction_number: "TRS-32133-423",
        borrower_payment_count: 32,
    },
]

const TransactionService = {
    /**
     * Get all transactions with pagination and filters
     */
    getAllTransactions: async (
        page = 1,
        limit = 10,
        search?: string | null,
        division?: string | null,
        district?: string | null,
        paymentMode?: string | null,
        _activeTab?: string,
        order_by?: string | null,
        sort?: string | null,
    ): Promise<ApiResponse<GetAllTransactionsResponse>> => {
        await new Promise((resolve) => setTimeout(resolve, 500))

        let filteredTransactions = [...sampleTransactions]

        // Apply search filter
        if (search) {
            filteredTransactions = filteredTransactions.filter(
                (transaction) =>
                    transaction.borrower_name.toLowerCase().includes(search.toLowerCase()) ||
                    transaction.transaction_number?.toLowerCase().includes(search.toLowerCase()) ||
                    transaction.pn_number.toLowerCase().includes(search.toLowerCase()),
            )
        }

        // Apply division filter
        if (division) {
            // In a real implementation, this would filter by division
            // For now, we'll just return the same data
        }

        // Apply district filter
        if (district) {
            filteredTransactions = filteredTransactions.filter(
                (transaction) => transaction.district?.toLowerCase() === district.toLowerCase(),
            )
        }

        // Apply payment mode filter
        if (paymentMode) {
            filteredTransactions = filteredTransactions.filter(
                (transaction) => transaction.mode_of_payment.toLowerCase() === paymentMode.toLowerCase(),
            )
        }

        // Apply sorting
        if (order_by && sort) {
            filteredTransactions.sort((a, b) => {
                const aValue = a[order_by as keyof Transaction]
                const bValue = b[order_by as keyof Transaction]

                if (typeof aValue === "number" && typeof bValue === "number") {
                    return sort === "asc" ? aValue - bValue : bValue - aValue
                }

                const aStr = String(aValue || "")
                const bStr = String(bValue || "")

                if (sort === "asc") {
                    return aStr.localeCompare(bStr)
                } else {
                    return bStr.localeCompare(aStr)
                }
            })
        }

        // Apply pagination
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

        return {
            status: "success",
            message: "Transactions retrieved successfully",
            data: {
                count: paginatedTransactions.length,
                transactions: paginatedTransactions,
                pagination: {
                    current_page: page,
                    per_page: limit,
                    total_pages: Math.ceil(filteredTransactions.length / limit),
                    total_items: filteredTransactions.length,
                },
            },
        }
    },

    /**
     * Get a specific transaction by ID
     */
    getTransactionById: async (id: string): Promise<ApiResponse<Transaction>> => {
        await new Promise((resolve) => setTimeout(resolve, 300))

        const transaction = sampleTransactions.find((t) => t.id === id)
        if (!transaction) {
            throw new Error("Transaction not found")
        }

        return {
            status: "success",
            message: "Transaction retrieved successfully",
            data: transaction,
        }
    },

    /**
     * Process payment
     */
    processPayment: async (): Promise<ApiResponse<null>> => {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        return {
            status: "success",
            message: "Payment processed successfully",
            data: null,
        }
    },

    /**
     * Export transactions to PDF
     */
    exportPdf: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        return {
            status: "success",
            message: "PDF export completed",
            data: {
                url: "https://example.com/transactions.pdf",
            },
        }
    },

    /**
     * Export transactions to CSV
     */
    exportCsv: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const csvContent = [
            "Borrower Name,Transaction Date,Loan Type,PN Number,Mode of Payment,Amount,Reference",
            ...sampleTransactions.map(
                (transaction) =>
                    `${transaction.borrower_name},${transaction.transaction_date},${transaction.loan_type},${transaction.pn_number},${transaction.mode_of_payment},${transaction.amount_transacted},"${transaction.reference}"`,
            ),
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv" })
        return blob
    },
}

export default TransactionService
