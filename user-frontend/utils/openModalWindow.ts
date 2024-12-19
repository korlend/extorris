import {
  useModalWindowStore,
  type ModalWindowData,
} from "@/store/modal_window";

export function openModalWindow<T = any>(
  data?: ModalWindowData,
  closeOnResult: boolean = true
): Promise<any> {
  const modalWindowStore = useModalWindowStore();
  return modalWindowStore.openModal<T>(data, closeOnResult);
}
