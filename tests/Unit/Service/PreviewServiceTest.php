<?php
namespace OCA\MemoPad\Tests\Unit\Service;

use OCA\MemoPad\Service\NoteService;
use OCA\MemoPad\Service\PreviewService;
use OCA\MemoPad\Service\ServiceException;

use OCP\IPreview;

use PHPUnit\Framework\TestCase;

class PreviewServiceTest extends TestCase {
    // private $previewManager;
    private $service;
    private $imageFile;
    private $previewData;
    private $previewManager;

    public function setUp() {
        // Mock the dependent objects
        $this->imageFile = $this->getMockBuilder('OCP\Files\File')
            ->disableOriginalConstructor()
            ->getMock();

        $this->previewData = "Some piece of data";

        $previewFile = $this->getMockBuilder('OCP\Files\SimpleFS\ISimpleFile')
            ->disableOriginalConstructor()
            ->getMock();
        $previewFile->method('getContent')->willReturn($this->previewData);

        $this->previewManager = $this->getMockBuilder('OCP\IPreview')
            ->disableOriginalConstructor()
            ->getMock();
        $this->previewManager
            ->method('getPreview')
            ->with(
                $this->equalTo($this->imageFile),
                $this->equalTo(100),
                $this->equalTo(100),
                $this->equalTo(false),
                $this->equalTo(IPreview::MODE_FILL),
                $this->equalTo(null))
            ->will($this->returnValue($previewFile));

        $this->service = new PreviewService($this->previewManager);
    }

    public function testPreviewServiceReturnDataForImageFile() {
        $this->previewManager->expects($this->once())
            ->method('isAvailable')
            ->with($this->equalTo($this->imageFile))
            ->will($this->returnValue(true));
        $this->assertEquals(
            $this->service->getPreviewData($this->imageFile, 100, 100), $this->previewData);
    }

    /**
     * @expectedException \OCA\MemoPad\Service\ServiceException
     */
    public function testPreviewServiceThrowExceptionWhenPreviewNotAvailable() {
        $this->previewManager
            ->method('isAvailable')
            ->with($this->equalTo($this->imageFile))
            ->will($this->returnValue(false));
            $this->service->getPreviewData($this->imageFile, 100, 100);
    }
}
