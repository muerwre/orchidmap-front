import { IState } from '../store';

export const selectEditor = (state: IState) => state.editor;
export const selectEditorSave = (state: IState) => state.editor.save;
export const selectEditorEditing = (state: IState) => state.editor.editing;
export const selectEditorMode = (state: IState) => state.editor.mode;
export const selectEditorActiveSticker = (state: IState) => state.editor.activeSticker;
export const selectEditorRenderer = (state: IState) => state.editor.renderer;
export const selectEditorRouter = (state: IState) => state.editor.router;
export const selectEditorDistance = (state: IState) => state.editor.distance;
export const selectEditorNominatim = (state: IState) => state.editor.nominatim;
export const selectEditorDirection = (state: IState) => state.editor.drawing_direction;
export const selectEditorGpx = (state: IState) => state.editor.gpx;
