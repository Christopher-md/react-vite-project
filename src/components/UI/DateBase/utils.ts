import { parseDigits } from "@/utils/parseDigits";

export const monthLength = {
    "01": "31",
    "02": "28",
    "03": "31",
    "04": "30",
    "05": "31",
    "06": "30",
    "07": "31",
    "08": "31",
    "09": "30",
    10: "31",
    11: "30",
    12: "31",
};

const concatHyphenBefore = (value: string, hyphen: string): string => (value.length !== 0 ? `${hyphen}${value}` : "");

const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

function limit(value: string, max: string, min = "01", length = 2): string {
    if (value.length === 1 && value[0] > max[0]) {
        // eslint-disable-next-line no-param-reassign
        value = `0${value}`;
    }

    if (value.length === length) {
        if (Number(value) === 0) {
            value = min;
        } else if (value > max) {
            // this can happen when user paste number
            value = max;
        } else if (value < min) {
            value = min;
        }
    }

    return value;
}

const maxDayOfMonth = (month: string, year: string, yearMin: string): string => {
    if (month.length === 2 && year.length === ((yearMin.length !== 0) || 4)) {
        const yearInt = parseInt(year, 10);
        if (
            parseInt(year, 10) > parseInt(yearMin, 10)
            && isLeapYear(yearInt)
            && Number(month) === 2
        ) {
            return "29";
        }
        return monthLength[month as keyof typeof monthLength];
    }

    return "31";
};

type Props = {
    hyphen: string;
    yearMax: string;
    yearMin: string;
};

export const validDate = (string: string, { hyphen, yearMax, yearMin }: Props): string => {
    const digits = parseDigits(string);

    const year = limit(digits.substring(4, 8), yearMax, yearMin, 4);
    const month = limit(digits.substring(2, 4), "12");
    const date = limit(
        digits.substring(0, 2),
        maxDayOfMonth(month, year, yearMin),
    );

    return date + concatHyphenBefore(month, hyphen) + concatHyphenBefore(year, hyphen);
};

export const formatDate = (string: string, hyphen: string): string => {
    const digits = parseDigits(string);
    const chars = digits.split("");

    return (
        chars
            .reduce(
                (r: string, v: string, index: number) => (
                    index === 2 || index === 4
                        ? `${r}${hyphen}${v}`
                        : `${r}${v}`),
                "",
            )
            .substring(0, 10)
    );
};
