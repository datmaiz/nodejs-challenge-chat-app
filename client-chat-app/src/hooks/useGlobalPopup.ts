import type { PopupConfig, PopupState, PopupVariant, UseGlobalPopupReturn } from '@/components/commons'
import { type ReactNode, useState } from 'react'

export const useGlobalPopup = (): UseGlobalPopupReturn => {
	const [popupState, setPopupState] = useState<PopupState>({
		isOpen: false,
		config: {},
	})

	const showPopup = (config: PopupConfig): void => {
		setPopupState({
			isOpen: true,
			config,
		})
	}

	const hidePopup = (): void => {
		setPopupState(prev => ({
			...prev,
			isOpen: false,
		}))
	}

	const confirm = (title: string, message: string | ReactNode, onConfirm?: () => void, onCancel?: () => void): void => {
		showPopup({
			variant: 'confirm',
			title,
			message,
			buttons: [
				{
					label: 'Hủy',
					variant: 'secondary',
					onClick: () => {
						onCancel?.()
						hidePopup()
					},
				},
				{
					label: 'Xác nhận',
					variant: 'primary',
					onClick: () => {
						onConfirm?.()
						hidePopup()
					},
				},
			],
		})
	}

	const alert = (title: string, message: string | ReactNode, variant: PopupVariant = 'info'): void => {
		showPopup({
			variant,
			title,
			message,
			buttons: [
				{
					label: 'OK',
					variant: 'primary',
					onClick: hidePopup,
				},
			],
		})
	}

	return {
		popupState,
		showPopup,
		hidePopup,
		confirm,
		alert,
	}
}
