import { useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface Country {
	code: string;
	dialCode: string;
	flag: string;
	name: string;
}

const COUNTRIES: Country[] = [
	{ code: "TR", dialCode: "90", flag: "\u{1F1F9}\u{1F1F7}", name: "Turkey" },
	{ code: "DE", dialCode: "49", flag: "\u{1F1E9}\u{1F1EA}", name: "Germany" },
	{ code: "US", dialCode: "1", flag: "\u{1F1FA}\u{1F1F8}", name: "United States" },
	{ code: "GB", dialCode: "44", flag: "\u{1F1EC}\u{1F1E7}", name: "United Kingdom" },
	{ code: "FR", dialCode: "33", flag: "\u{1F1EB}\u{1F1F7}", name: "France" },
	{ code: "AZ", dialCode: "994", flag: "\u{1F1E6}\u{1F1FF}", name: "Azerbaijan" },
	{ code: "GE", dialCode: "995", flag: "\u{1F1EC}\u{1F1EA}", name: "Georgia" },
	{ code: "RU", dialCode: "7", flag: "\u{1F1F7}\u{1F1FA}", name: "Russia" },
	{ code: "KZ", dialCode: "7", flag: "\u{1F1F0}\u{1F1FF}", name: "Kazakhstan" },
	{ code: "UZ", dialCode: "998", flag: "\u{1F1FA}\u{1F1FF}", name: "Uzbekistan" },
	{ code: "TM", dialCode: "993", flag: "\u{1F1F9}\u{1F1F2}", name: "Turkmenistan" },
	{ code: "KG", dialCode: "996", flag: "\u{1F1F0}\u{1F1EC}", name: "Kyrgyzstan" },
	{ code: "IR", dialCode: "98", flag: "\u{1F1EE}\u{1F1F7}", name: "Iran" },
	{ code: "IQ", dialCode: "964", flag: "\u{1F1EE}\u{1F1F6}", name: "Iraq" },
	{ code: "SY", dialCode: "963", flag: "\u{1F1F8}\u{1F1FE}", name: "Syria" },
	{ code: "AF", dialCode: "93", flag: "\u{1F1E6}\u{1F1EB}", name: "Afghanistan" },
	{ code: "PK", dialCode: "92", flag: "\u{1F1F5}\u{1F1F0}", name: "Pakistan" },
	{ code: "IN", dialCode: "91", flag: "\u{1F1EE}\u{1F1F3}", name: "India" },
	{ code: "CN", dialCode: "86", flag: "\u{1F1E8}\u{1F1F3}", name: "China" },
	{ code: "UA", dialCode: "380", flag: "\u{1F1FA}\u{1F1E6}", name: "Ukraine" },
	{ code: "BG", dialCode: "359", flag: "\u{1F1E7}\u{1F1EC}", name: "Bulgaria" },
	{ code: "NL", dialCode: "31", flag: "\u{1F1F3}\u{1F1F1}", name: "Netherlands" },
	{ code: "IT", dialCode: "39", flag: "\u{1F1EE}\u{1F1F9}", name: "Italy" },
	{ code: "ES", dialCode: "34", flag: "\u{1F1EA}\u{1F1F8}", name: "Spain" },
	{ code: "GR", dialCode: "30", flag: "\u{1F1EC}\u{1F1F7}", name: "Greece" },
	{ code: "SA", dialCode: "966", flag: "\u{1F1F8}\u{1F1E6}", name: "Saudi Arabia" },
	{ code: "AE", dialCode: "971", flag: "\u{1F1E6}\u{1F1EA}", name: "UAE" },
	{ code: "EG", dialCode: "20", flag: "\u{1F1EA}\u{1F1EC}", name: "Egypt" },
	{ code: "KR", dialCode: "82", flag: "\u{1F1F0}\u{1F1F7}", name: "South Korea" },
	{ code: "JP", dialCode: "81", flag: "\u{1F1EF}\u{1F1F5}", name: "Japan" },
];

const DEFAULT_COUNTRY = COUNTRIES[0];

const SORTED_BY_LENGTH = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);

function parsePhoneValue(value: string): { country: Country; localNumber: string } {
	if (!value.startsWith("+")) {
		return { country: DEFAULT_COUNTRY, localNumber: "" };
	}
	const digits = value.slice(1);
	for (const country of SORTED_BY_LENGTH) {
		if (digits.startsWith(country.dialCode)) {
			return { country, localNumber: digits.slice(country.dialCode.length) };
		}
	}
	return { country: DEFAULT_COUNTRY, localNumber: digits };
}

interface PhoneInputProps {
	value: string;
	onChange: (value: string) => void;
	className?: string;
	id?: string;
	disabled?: boolean;
	placeholder?: string;
}

export function PhoneInput({
	value,
	onChange,
	className,
	id,
	disabled,
	placeholder,
}: PhoneInputProps) {
	const { country, localNumber } = useMemo(() => parsePhoneValue(value), [value]);

	const emitChange = useCallback(
		(dialCode: string, number: string) => {
			const trimmed = number.replace(/\D/g, "");
			if (!trimmed) {
				onChange("");
				return;
			}
			onChange(`+${dialCode}${trimmed}`);
		},
		[onChange],
	);

	const handleCountryChange = useCallback(
		(dialCode: string | null) => {
			if (!dialCode) return;
			emitChange(dialCode, localNumber);
		},
		[emitChange, localNumber],
	);

	const handleNumberChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const raw = e.target.value.replace(/\D/g, "");
			emitChange(country.dialCode, raw);
		},
		[emitChange, country.dialCode],
	);

	return (
		<div className={cn("flex", className)}>
			<Select value={country.dialCode} onValueChange={handleCountryChange}>
				<SelectTrigger
					size="sm"
					className="h-10 shrink-0 rounded-r-none border-r-0 bg-stone-50 pr-1.5 pl-2.5 text-[15px] focus-visible:z-10 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800/50"
				>
					<SelectValue>
						<span className="flex items-center gap-1">
							<span>{country.flag}</span>
							<span className="text-stone-500 dark:text-stone-400">+{country.dialCode}</span>
						</span>
					</SelectValue>
				</SelectTrigger>
				<SelectContent align="start" alignItemWithTrigger={false}>
					<SelectScrollUpButton />
					{COUNTRIES.map((c) => (
						<SelectItem key={`${c.code}-${c.dialCode}`} value={c.dialCode}>
							<span className="flex items-center gap-2">
								<span>{c.flag}</span>
								<span className="text-stone-600 dark:text-stone-300">{getLocalTrName(c.code)}</span>
								<span className="text-stone-400 dark:text-stone-500">+{c.dialCode}</span>
							</span>
						</SelectItem>
					))}
					<SelectScrollDownButton />
				</SelectContent>
			</Select>
			<Input
				id={id}
				type="tel"
				autoComplete="tel"
				disabled={disabled}
				placeholder={placeholder ?? "5XX XXX XX XX"}
				value={localNumber}
				onChange={handleNumberChange}
				className="h-10 rounded-l-none border-stone-200 bg-stone-50 text-[15px] placeholder:text-stone-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800/50 dark:placeholder:text-stone-500"
			/>
		</div>
	);
}

function getLocalTrName(code: string): string {
	const map: Record<string, string> = {
		TR: "Türkiye",
		DE: "Almanya",
		US: "Amerika",
		GB: "İngiltere",
		FR: "Fransa",
		AZ: "Azerbaycan",
		GE: "Gürcistan",
		RU: "Rusya",
		KZ: "Kazakistan",
		UZ: "Özbekistan",
		TM: "Türkmenistan",
		KG: "Kırgızistan",
		IR: "İran",
		IQ: "Irak",
		SY: "Suriye",
		AF: "Afganistan",
		PK: "Pakistan",
		IN: "Hindistan",
		CN: "Çin",
		UA: "Ukrayna",
		BG: "Bulgaristan",
		NL: "Hollanda",
		IT: "İtalya",
		ES: "İspanya",
		GR: "Yunanistan",
		SA: "Suudi Arabistan",
		AE: "BAE",
		EG: "Mısır",
		KR: "Güney Kore",
		JP: "Japonya",
	};
	return map[code] ?? code;
}
