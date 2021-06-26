/*
 * @Author: cc
 * @LastEditTime: 2021-06-26 17:56:46
 */
export function CreateElement(type, config = {}, ...children) {
  return {
    type,
    props: {
      ...config,
      children,
    },
  };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { CreateElement };
