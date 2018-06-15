<?php
namespace OCA\MemoPad\Controller;

use OCP\IRequest;
// use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\ApiController;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\DataDisplayResponse;
use OCP\Files\IRootFolder;
use OCP\IPreview;
use OCP\Preview\IProvider;
// use OC\Preview\Provider;
use OC\Preview\Image;
use OC\Preview\JPEG;

use OCA\MemoPad\Http\ImageResponse;
use OCA\MemoPad\Service\ImageService;
use OCA\MemoPad\Service\PreviewService;


class DebugController extends ApiController {
    private $imageService;

    private $previewService;

	public function __construct(
        $AppName,
        IRequest $request,
        ImageService $imageService,
        PreviewService $previewService
    ) {
		parent::__construct($AppName, $request);
        $this->imageService = $imageService;
        $this->previewService = $previewService;
	}

	/**
     * @CORS
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function index() {
        $imageFiles = $this->imageService->getImageFiles();

        $previewData = $this->previewService->getPreviewData($imageFiles[0], 100, 100);
        return new ImageResponse($previewData, "image/jpeg");
        // $result = "";
        //
        // $userFolder = $this->rootFolder->getUserFolder($this->userId);
        // // foreach ($userFolder->getDirectoryListing() as $node) {
        //
        // $imageFile;
        // // NOTE: use "image/*" as mime type doesn't work
        // foreach ($userFolder->searchByMime("image") as $node) {
        //     $result = $result . ($node->getPath()) . " ";
        //     $result = $result . " isPreviewAvailabile:" . $this->previewManager->isAvailable($node) . " ";
        //     $imageFile = $node;
        // }
        //
        // $previewFile = $this->previewManager->
        //     getPreview($imageFile, 100, 100, false, IPreview::MODE_FILL, null);
        //
        // $previewContent = $previewFile->getContent();
        //
        // $params = array(
        //     'IRootFolder' => $result,
        //     // 'IPreview' => $this->previewManager->isMimeSupported("image"),
        //     // 'Preview providers' => $this->previewManager->getProviders(),
        //     // 'Preview data' => $previewFile->getName(),
        // );
        // return new JSONResponse($params);
        // return new DataDisplayResponse($previewFile->getContent());
        // return new ImageResponse($previewFile->getContent(), "image/jpeg");
	}

    // public function getFileFromPath($userId, $path) {
	// 	return $this->rootFolder->getUserFolder($userId)->get($path);
	// }
    // $node = $this->getFileFromPath($str, $params['path']);
    // $size = $node->getSize();
    // $time = $node->getMTime();
}
