import { getEstimated } from '~/utils/format';
import * as ACTIONS from '~/redux/editor/actions';
import { EDITOR_ACTIONS } from '~/redux/editor/constants';
import { IEditorState } from '~/redux/editor';
import { TIPS } from '~/constants/tips';

const setEditing = (
  state,
  { editing }: ReturnType<typeof ACTIONS.editorSetEditing>
): IEditorState => ({
  ...state,
  editing,
});

const setChanged = (
  state,
  { changed }: ReturnType<typeof ACTIONS.editorSetChanged>
): IEditorState => ({
  ...state,
  changed,
});

const setMode = (state, { mode }: ReturnType<typeof ACTIONS.editorSetMode>): IEditorState => ({
  ...state,
  mode,
});

const setDistance = (
  state,
  { distance }: ReturnType<typeof ACTIONS.editorSetDistance>
): IEditorState => ({
  ...state,
  distance: parseFloat(distance.toFixed(1)),
  estimated: getEstimated(distance, state.speed),
});

const setRouterPoints = (
  state,
  { routerPoints }: ReturnType<typeof ACTIONS.editorSetRouterPoints>
): IEditorState => ({
  ...state,
  routerPoints,
});

const setActiveSticker = (
  state,
  { activeSticker }: ReturnType<typeof ACTIONS.editorSetActiveSticker>
): IEditorState => ({
  ...state,
  activeSticker: activeSticker || { set: null, sticker: null },
});

const hideRenderer = (state): IEditorState => ({
  ...state,
  renderer: { ...state.renderer, renderer_active: false },
});

const setRenderer = (
  state,
  { payload }: ReturnType<typeof ACTIONS.editorSetRenderer>
): IEditorState => ({
  ...state,
  renderer: { ...state.renderer, ...payload },
});

const sendSaveRequest = (state): IEditorState => ({
  ...state,
  save_processing: true,
});

const setSave = (state, { save }: ReturnType<typeof ACTIONS.editorSetSave>): IEditorState => ({
  ...state,
  save: {
    ...state.save,
    ...save,
  },
});

const resetSaveDialog = (state): IEditorState => ({
  ...state,
  save_overwriting: false,
  save_finished: false,
  save_processing: false,
  save_error: '',
});

const setDialog = (
  state,
  { dialog }: ReturnType<typeof ACTIONS.editorSetDialog>
): IEditorState => ({
  ...state,
  dialog,
});

const setDialogActive = (
  state,
  { dialog_active }: ReturnType<typeof ACTIONS.editorSetDialogActive>
): IEditorState => ({
  ...state,
  dialog_active: dialog_active || !state.dialog_active,
});

const setReady = (
  state,
  { ready = true }: ReturnType<typeof ACTIONS.editorSetReady>
): IEditorState => ({
  ...state,
  ready,
});

const setSpeed = (
  state,
  { speed = 15 }: ReturnType<typeof ACTIONS.editorSetSpeed>
): IEditorState => ({
  ...state,
  speed,
  estimated: getEstimated(state.distance, speed),
});

const setMarkersShown = (
  state,
  { markers_shown = true }: ReturnType<typeof ACTIONS.editorSetMarkersShown>
): IEditorState => ({ ...state, markers_shown });

const setIsEmpty = (
  state,
  { is_empty = true }: ReturnType<typeof ACTIONS.editorSetIsEmpty>
): IEditorState => ({ ...state, is_empty });

const setFeature = (
  state,
  { features }: ReturnType<typeof ACTIONS.editorSetFeature>
): IEditorState => ({
  ...state,
  features: {
    ...state.features,
    ...features,
  },
});

const setIsRouting = (
  state,
  { is_routing }: ReturnType<typeof ACTIONS.editorSetIsRouting>
): IEditorState => ({
  ...state,
  is_routing,
});

const setRouter = (
  state,
  { router }: ReturnType<typeof ACTIONS.editorSetRouter>
): IEditorState => ({
  ...state,
  router: {
    ...state.router,
    ...router,
  },
});

export const EDITOR_HANDLERS = {
  [EDITOR_ACTIONS.SET_EDITING]: setEditing,
  [EDITOR_ACTIONS.SET_CHANGED]: setChanged,
  [EDITOR_ACTIONS.SET_MODE]: setMode,
  [EDITOR_ACTIONS.SET_DISTANCE]: setDistance,
  [EDITOR_ACTIONS.SET_ROUTER_POINTS]: setRouterPoints,
  [EDITOR_ACTIONS.SET_ACTIVE_STICKER]: setActiveSticker,

  [EDITOR_ACTIONS.SET_SAVE]: setSave,

  [EDITOR_ACTIONS.SEND_SAVE_REQUEST]: sendSaveRequest,
  [EDITOR_ACTIONS.RESET_SAVE_DIALOG]: resetSaveDialog,

  [EDITOR_ACTIONS.HIDE_RENDERER]: hideRenderer,
  [EDITOR_ACTIONS.SET_RENDERER]: setRenderer,

  [EDITOR_ACTIONS.SET_DIALOG]: setDialog,
  [EDITOR_ACTIONS.SET_DIALOG_ACTIVE]: setDialogActive,
  [EDITOR_ACTIONS.SET_READY]: setReady,

  [EDITOR_ACTIONS.SET_SPEED]: setSpeed,
  [EDITOR_ACTIONS.SET_MARKERS_SHOWN]: setMarkersShown,
  [EDITOR_ACTIONS.SET_IS_EMPTY]: setIsEmpty,

  [EDITOR_ACTIONS.SET_FEATURE]: setFeature,
  [EDITOR_ACTIONS.SET_IS_ROUTING]: setIsRouting,
  [EDITOR_ACTIONS.SET_ROUTER]: setRouter,
};
