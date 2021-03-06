import { vec3, mat4 } from 'gl-matrix';

export const CreateTransforms = (modelMat: mat4, translation: vec3 = [0, 0, 0], rotation: vec3 = [0, 0, 0], scaling: vec3 = [1, 1, 1]) => {
    const rotateXMat = mat4.create();
    const rotateYMat = mat4.create();
    const rotateZMat = mat4.create();
    const translateMat = mat4.create();
    const scaleMat = mat4.create();

    //perform individual transformations
    mat4.fromTranslation(translateMat, translation);
    mat4.fromXRotation(rotateXMat, rotation[0]);
    mat4.fromYRotation(rotateYMat, rotation[1]);
    mat4.fromZRotation(rotateZMat, rotation[2]);
    mat4.fromScaling(scaleMat, scaling);

    //combine all transformation matrices together to form a final transform matrix: modelMat
    mat4.multiply(modelMat, rotateXMat, scaleMat);
    mat4.multiply(modelMat, rotateYMat, modelMat);
    mat4.multiply(modelMat, rotateZMat, modelMat);
    mat4.multiply(modelMat, translateMat, modelMat);
};

export const CreateViewProjection = (respectRatio = 1.0, cameraPosition: vec3 = [2, 2, 4], lookDirection: vec3 = [0, 0, 0],
    upDirection: vec3 = [0, 1, 0]) => {

    const viewMatrix = mat4.create();
    const projectionMatrix = mat4.create();
    const viewProjectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, 2 * Math.PI / 5, respectRatio, 0.1, 100.0);

    mat4.lookAt(viewMatrix, cameraPosition, lookDirection, upDirection);
    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

    const cameraOption = {
        eye: cameraPosition,
        center: lookDirection,
        zoomMax: 100,
        zoomSpeed: 2
    };

    return {
        viewMatrix,
        projectionMatrix,
        viewProjectionMatrix,
        cameraOption
    }
};


export const CreateGPUBufferUint = (device: GPUDevice, data: Uint32Array,
    usageFlag: GPUBufferUsageFlags = GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST) => {
    const buffer = device.createBuffer({
        size: data.byteLength,
        usage: usageFlag,
        mappedAtCreation: true
    });
    new Uint32Array(buffer.getMappedRange()).set(data);
    buffer.unmap();
    return buffer;
};

export const CreateGPUBuffer = (device: GPUDevice, data: Float32Array,
    usageFlag: GPUBufferUsageFlags = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST) => {
    const buffer = device.createBuffer({
        size: data.byteLength,
        usage: usageFlag,
        mappedAtCreation: true
    });
    new Float32Array(buffer.getMappedRange()).set(data);
    buffer.unmap();
    return buffer;
};

export const InitGPU = async () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    console.log(canvas);
    const entry: any = navigator.gpu;
    if (!entry) {
        throw new Error('WebGPU is not supported on this browser.???????????????????????????')
    }
    console.log(navigator.gpu);
    const adapter:any = await entry.requestAdapter();
    console.log(adapter);
    const device:any = await adapter.requestDevice();
    console.log(device);
    const context:any = canvas.getContext('webgpu') as GPUCanvasContext;
    console.log(context);
    const format = 'bgra8unorm';
    context.configure({
        device: device,
        format: format,
        usage: (GPUTextureUsage as any).OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC
    });
    return { device, canvas, format, context };
};

/*export const InitGPU = async () => {
    const checkgpu = CheckWebGPU();
    if(checkgpu.includes('Your current browser does not support WebGPU!')){
        console.log(checkgpu);
        throw('Your current browser does not support WebGPU!');
    }
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const adapter = await navigator.gpu?.requestAdapter();
    const device = await adapter?.requestDevice() as GPUDevice;
    const context = canvas.getContext('gpupresent') as unknown as GPUCanvasContext;
    const swapChainFormat = 'bgra8unorm';
    const swapChain = context.configureSwapChain({
        device: device,
        format: swapChainFormat
    });
    return{device, canvas, swapChainFormat, swapChain };
};*/

export const CheckWebGPU = () => {
    let result = 'Great, your current browser supports WebGPU!';
    if (!navigator.gpu) {
        result = `Your current browser does not support WebGPU! Make sure you are on a system 
                     with WebGPU enabled. Currently, SPIR-WebGPU is only supported in  
                     <a href="https://www.google.com/chrome/canary/">Chrome canary</a>
                     with the flag "enable-unsafe-webgpu" enabled. See the 
                     <a href="https://github.com/gpuweb/gpuweb/wiki/Implementation-Status"> 
                     Implementation Status</a> page for more details.                   
                    `;
    }
    return result;
};