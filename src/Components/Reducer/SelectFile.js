export default function Dropdown(state = { value: [] }, action) {
  
  switch (action.type) {
    case 'SelectFile':
      break;
      case 'SelectFile_START':
      console.log(action, '-----reducer')
      return { ...state, value: action.payload };

    default:
  }
  return state;
}
